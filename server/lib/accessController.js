function compareHours(a, b) {
  const compHours = +a.hh - +b.hh;
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
    days: schedules
      .slice(1)
      .reduce(
        (allDays, { days }) =>
          days.map((day, i) =>
            getMergedIntervals([...allDays[i].intervals, ...day.intervals])
          ),
        schedules[0].days
      ),
  };
}

export default function accessController({ app, db }) {
  app.get("/access/:doorid", (req, res) => {
    const doorId = req.params.doorid;
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

    res.send({ schedulePerBadge, generatedSchedules });
  });
}
