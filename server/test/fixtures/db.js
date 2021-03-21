function getTime() {
  const date = new Date();
  return {
    HH: date.getHours().toString(),
    mm: date.getMinutes().toString(),
    dayIndex: (date.getDay() + 6) % 7,
  };
}

function createPassingIntervals() {
  const time = getTime();
  return new Array(7)
    .fill(0)
    .slice(0, time.dayIndex)
    .map(() => ({ intervals: [] }))
    .concat({
      intervals: [{
        start: { HH: time.HH, mm: time.mm - 1 },
        end: { HH: time.HH, mm: time.mm + 1 },
      },
      ],
    })
    .concat(new Array(7)
      .fill(0)
      .slice(time.dayIndex + 1)
      .map(() => ({ intervals: [] })));
}

function createFailingIntervals() {
  const time = getTime();
  return new Array(7)
    .fill(0)
    .slice(0, time.dayIndex)
    .map(() => ({ intervals: [] }))
    .concat({
      intervals: [{
        start: { HH: time.HH, mm: time.mm - 2 },
        end: { HH: time.HH, mm: time.mm - 1 },
      },
      {
        start: { HH: time.HH, mm: time.mm + 1 },
        end: { HH: time.HH, mm: time.mm - 2 },
      },
      ],
    })
    .concat(new Array(7)
      .fill(0)
      .slice(time.dayIndex + 1)
      .map(() => ({ intervals: [] })));
}
export const schedules = [
  {
    shouldAccess: true,
    id: 'idSchedule1',
    doorId: 'idDoor1',
    days: new Array(7).fill(0).map(() => ({ allDay: true })),
  },
  {
    shouldAccess: true,
    id: 'idSchedule2',
    doorId: 'idDoor2',

    days: createPassingIntervals(),
  },
  {
    shouldAccess: false,
    id: 'idSchedule3',
    doorId: 'idDoor3',
    days: createFailingIntervals(),
  },
];
export default {
  groups: [
    {
      id: 'idGroup1',
      name: 'group1',
      doorAccess: schedules.reduce((acc, { id, doorId }, i) => {
        acc[doorId] = id;
        return acc;
      }, {}),
    },
  ],
  schedules: [
    {
      id: 'idSchedule1',
      name: 'schedule1',
      days: new Array(7).fill(0).map(() => ({ allDay: true })),
    },
    {
      id: 'idSchedule2',
      name: 'schedule2',
      days: createPassingIntervals(),
    },
    {
      id: 'idSchedule3',
      name: 'schedule3',
      // failing intervals
      days: createFailingIntervals(),
    },
  ],
  doors: schedules.map(({ doorId }, i) => ({
    name: `door-${i}`,
    id: doorId,
  })),
};
