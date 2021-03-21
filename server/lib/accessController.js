import { v4 as uuid } from 'uuid';
import { compareHours } from './utils/index';

function getMergedIntervals(intervals) {
  if (!intervals.length) return [{}];
  const sortedIntervals = intervals
    .filter(({ start, end }) => start && end)
    .sort((a, b) => compareHours(a.start, b.start));
  return sortedIntervals.slice(1).reduce(
    (mergedIntervals, { start, end }) => {
      // intervals cross each other:
      const lastInterval = mergedIntervals[mergedIntervals.length - 1];
      if (compareHours(lastInterval.end, start) <= 0) {
        lastInterval.end = end;
      } else {
        // intervals are not crossing
        mergedIntervals.push({ start, end });
      }
      return mergedIntervals;
    },
    [sortedIntervals[0]],
  );
}

function getLargestSchedule(schedules) {
  return {
    id: schedules.map(({ id }) => id).join('-'),
    days: schedules.slice(1).reduce(
      (allDays, { days }) => days.map((day, i) => ({
        allDay: day.allDay || allDays[i].allDay,
        intervals: getMergedIntervals([
          ...allDays[i].intervals,
          ...day.intervals,
        ]),
      })),
      schedules[0].days,
    ),
  };
}

function authorizeAccess(doorId, badgeId, db) {
  const schedulePerGroupId = db
    .get('groups')
    .value()
    .filter(({ doorAccess }) => doorAccess[doorId])
    .reduce((acc, { id, doorAccess }) => {
      const schedule = db
        .get('schedules')
        .find({ id: doorAccess[doorId] })
        .value();
      acc[id] = schedule;
      return acc;
    }, {});

  const user = db
    .get('users')
    .find(({ badges }) => badges.some((badge) => badge === badgeId))
    .value();
  if (!user) return { authorized: false, error: 'unknown-badge' };
  const allowedGroups = user.groups.filter((id) => schedulePerGroupId[id]);
  if (!allowedGroups.length) return { authorized: false, error: 'no-access-door' };

  const schedule = getLargestSchedule(
    allowedGroups.map((groupId) => schedulePerGroupId[groupId]),
  );

  const date = new Date();
  const time = {
    HH: date.getHours().toString(),
    mm: date.getMinutes().toString(),
  };
  const dayIndex = (date.getDay() + 6) % 7;
  const scheduleDay = schedule.days[dayIndex];

  if (scheduleDay.allDay === true) return { authorized: true };

  const authorized = scheduleDay.intervals.some(
    ({ start, end }) => start
      && end
      && compareHours(start, time) <= 0
      && compareHours(time, end) <= 0,
  );
  return authorized ? { authorized } : { authorized, error: 'not-in-shcedule' };
}

function getLastUnknownBadge(db) {
  return db
    .get('logs')
    .filter({ error: 'unknown-badge' })
    .sort((a, b) => b.date - a.date)
    .value()
    .slice(0, 1)
    .filter(({ date }) => Date.now() - date < 5 * 60 * 1000);
}
const state = {
  isAddingBadge: false,
  timeoutAddingBadge: null,
  lastUnknown: null,
  user: null,
};
function resetState() {
  state.isAddingBadge = false;
  state.lastUnknown = null;
  state.user = null;
  clearTimeout(state.timeoutAddingBadge);
}
export default function accessController({ app, db, authMiddleware }) {
  app.get('/access/download/:type/:doorId', (req, res) => {
    const { type, doorId } = req.params;
    const schedulePerGroupId = db
      .get('groups')
      .value()
      .filter(({ doorAccess }) => doorAccess[doorId])
      .reduce((acc, { id, doorAccess }) => {
        const schedule = db
          .get('schedules')
          .find({ id: doorAccess[doorId] })
          .value();
        acc[id] = schedule;
        return acc;
      }, {});

    const users = db.get('users').value();

    const generatedSchedules = {};
    const schedulePerBadge = users.reduce(
      (schedulePerBadge, { groups, badges }) => {
        const allowedGroups = groups.filter((id) => schedulePerGroupId[id]);
        if (!allowedGroups.length) return schedulePerBadge;

        const schedule = getLargestSchedule(
          allowedGroups.map((groupId) => schedulePerGroupId[groupId]),
        );
        generatedSchedules[schedule.id] = schedule.days;
        badges.forEach((badgeUuid) => {
          schedulePerBadge[badgeUuid] = schedule.id;
        });
        return schedulePerBadge;
      },
      {},
    );
    if (type === 'badge') {
      res.send(
        Object.entries(schedulePerBadge).reduce(
          (csv, [badgeId, scheduleId]) => (`${csv}${badgeId},${scheduleId}\n`),
          '',
        ),
      );
    }
    if (type === 'schedule') {
      res.send(generatedSchedules);
    }
  });

  app.get('/access/:doorId/:badgeId', (req, res) => {
    const { badgeId, doorId } = req.params;

    // console.log('request DoorId', doorId, 'badgeId', badgeId);

    const { authorized, error } = authorizeAccess(doorId, badgeId, db);
    db.get('logs')
      .push({
        id: uuid(),
        date: Date.now(),
        door: doorId,
        badge: badgeId,
        authorized,
        error,
      })
      .write();
    if (!authorized && error === 'unknown-badge' && state.isAddingBadge) {
      state.lastUnknown = badgeId;
      return res.sendStatus(202);
    }

    res.sendStatus(authorized ? 200 : 400);
  });

  app.post('/badge/start-adding', authMiddleware, (req, res) => {
    // set into addingBadge mode
    const user = db.get('users')
      .find(({ id }) => id === req.body.userId)
      .value();
    if (!user) return res.sendStatus(400);
    if (state.isAddingBadge) return res.sendStatus(402);

    resetState();
    state.isAddingBadge = true;
    state.lastUnknown = getLastUnknownBadge(db);
    state.user = user;
    state.timeoutAddingBadge = setTimeout(() => {
      resetState();
    }, 5 * 60 * 1000);

    res.send(state.lastUnknown);
  });

  app.post('/badge/stop-adding', authMiddleware, (req, res) => {
    resetState();
    res.send(200);
  });

  app.get('/badge/last-unknown', authMiddleware, (req, res) => {
    if (!state.isAddingBadge) {
      // if not adding badge, send timeout error
      return res.send(408);
    }
    res.send(state.lastUnknown);
  });

  app.post('/badge/assign', authMiddleware, (req, res) => {
    if (!state.isAddingBadge) {
      return res.send(408);
    }
    if (!state.lastUnknown) {
      return res.send(406);
    }

    if (!state.user) {
      return res.send(500);
    }

    const user = db
      .get('users')
      .find(({ id }) => id === state.user.id)
      .value();

    if (!user) {
      return res.send(500);
    }
    db.get('users').find({ id: user.id }).assign({
      ...user,
      badges: user.badges.concat(state.lastUnknown),
    }).write();

    resetState();
    res.send(200);
  });
}
