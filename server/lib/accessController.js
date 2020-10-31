import { v4 as uuid } from "uuid";

function compareHours(a, b) {
  const compHours = +a.HH - +b.HH;
  const compMins = +a.mm - +b.mm;
  return compHours === 0 ? compMins : compHours;
}

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
    [sortedIntervals[0]]
  );
}

function getLargestSchedule(schedules) {
  return {
    id: schedules.map(({ id }) => id).join("-"),
    days: schedules.slice(1).reduce(
      (allDays, { days }) =>
        days.map((day, i) => ({
          allDay: day.allDay || allDays[i].allDay,
          intervals: getMergedIntervals([
            ...allDays[i].intervals,
            ...day.intervals,
          ]),
        })),
      schedules[0].days
    ),
  };
}

function authorizeAccess(doorId, badgeId, db) {
  const schedulePerGroupId = db
    .get("groups")
    .value()
    .filter(({ doorAccess }) => doorAccess[doorId])
    .reduce((acc, { id, doorAccess }) => {
      const schedule = db
        .get("schedules")
        .find({ id: doorAccess[doorId] })
        .value();
      acc[id] = schedule;
      return acc;
    }, {});

  const user = db
    .get("users")
    .find(({ badges }) => badges.some((badge) => badge === badgeId))
    .value();
  if (!user) return false;
  const allowedGroups = user.groups.filter((id) => schedulePerGroupId[id]);
  if (!allowedGroups.length) return false;

  const schedule = getLargestSchedule(
    allowedGroups.map((groupId) => schedulePerGroupId[groupId])
  );

  const date = new Date();
  const time = {
    HH: date.getHours().toString(),
    mm: date.getMinutes().toString(),
  };
  const dayIndex = (date.getDay() + 6) % 7;
  const scheduleDay = schedule.days[dayIndex];

  if (scheduleDay.allDay === true) return true;

  return scheduleDay.intervals.some(
    ({ start, end }) =>
      start &&
      end &&
      compareHours(start, time) <= 0 &&
      compareHours(time, end) <= 0
  );
}

export default function accessController({ app, db }) {
  app.get("/access/download/:type/:doorid", (req, res) => {
    const doorId = req.params.doorid;
    const type = req.params.type;
    const schedulePerGroupId = db
      .get("groups")
      .value()
      .filter(({ doorAccess }) => doorAccess[doorId])
      .reduce((acc, { id, doorAccess }) => {
        const schedule = db
          .get("schedules")
          .find({ id: doorAccess[doorId] })
          .value();
        acc[id] = schedule;
        return acc;
      }, {});

    const users = db.get("users").value();

    let generatedSchedules = {};
    const schedulePerBadge = users.reduce(
      (schedulePerBadge, { firstname, groups, badges }) => {
        const allowedGroups = groups.filter((id) => schedulePerGroupId[id]);
        if (!allowedGroups.length) return schedulePerBadge;

        const schedule = getLargestSchedule(
          allowedGroups.map((groupId) => schedulePerGroupId[groupId])
        );
        generatedSchedules[schedule.id] = schedule;
        badges.forEach((badgeUuid) => {
          schedulePerBadge[badgeUuid] = schedule.id;
        });
        return schedulePerBadge;
      },
      {}
    );
    if(type === 'badge'){
      res.send(
        Object.entries(schedulePerBadge)
         .reduce((csv, [badgeId, scheduleId]) => 
          csv += `${badgeId},${scheduleId}\n` ,'')
      );
    }
    if(type === 'schedule'){
      res.send(generatedSchedules);
    }
  });

  app.get("/access/:doorid/:badgeId", (req, res) => {
    const doorId = req.params.doorid;
    const badgeId = req.params.badgeId;

    console.log("request DoorId", doorId, "badgeId", badgeId);

    const authorized = authorizeAccess(doorId, badgeId, db) ? 200 : 400;
    db.get("logs")
      .push({
        id: uuid(),
        date: Date.now(),
        door: doorId,
        badge: badgeId,
        authorized,
      })
      .write();

    res.send(authorized);
  });
}
