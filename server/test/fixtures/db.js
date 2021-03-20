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

export default {
  groups: [
    {
      id: 'idGroup1',
      name: 'group1',
      doorAccess: {
        idDoor1: 'idSchedule1',
        idDoor2: 'idSchedule2',
        idDoor3: 'idSchedule3',
      },
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
  doors: [
    {
      id: 'idDoor1',
      name: 'door1',
    },
    {
      id: 'idDoor2',
      name: 'door2',
    },
    {
      id: 'idDoor3',
      name: 'door3',
    },
  ],
};
