export default {
  groups: [
    {
      id: 'idGroup1',
      name: 'group1',
      doorAccess: {
        idDoor1: 'idSchedule1',
      },
    },

  ],
  schedules: [
    {
      id: 'idSchedule1',
      name: 'schedule1',
      days: new Array(7).fill(0).map(() => ({ allDay: true })),
    },
  ],
  doors: [
    {
      id: 'idDoor1',
      name: 'door1',
    },
  ],
};
