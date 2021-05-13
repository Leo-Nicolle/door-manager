<template>
  <form-modal
    ref="form"
    :title="
      $route.params.id === 'new'
        ? 'Nouveau Groupe'
        : `${groupWithScheduleNames.name}`
    "
    :item="groupWithScheduleNames"
    :filteredData="filteredSchedules"
    :schema="schema"
    @submit="submit"
    @remove="remove"
    @close="$emit('close')"
  />
</template>

<script>
import formModal from "./formModal";

export default {
  name: "GroupForm",
  props: ["group"],
  computed: {
    schema: function () {
      return {
        fields: [
          {
            label: "Nom",
            model: "name",
            type: "name",
          },
          {
            type: "buttons",
            class: "button-section",
            buttons: this.doors.map((door, i) => ({
              label: door.name,
              type: `is-primary ${
                i === this.doorIndex ? "is-light" : "is-dark"
              }`,
              click: () => (this.doorIndex = i),
            })),
          },
          {
            type: "autocomplete",
            condition: () => this.doorIndex >= 0,
            model: `schedules`,
            label: "Horraire autorisé",
            getFilteredData: (text) => {
              this.getFilteredSchedules(text);
            },
            options: this.schedules.map((schedule, i) => {
              console.log("schedules", this.doorIndex);
              return {
                value: schedule.id,
                selected: i === 0,
                //   this.group.schedules[this.currentDoor.id] === schedule.id,
                key: schedule.id,
                label: schedule.name,
              };
            }),
          },
        ],
        required: ["name"],
      };
    },
    currentDoor: function () {
      return this.doors[this.doorIndex];
    },
  },
  data() {
    return {
      doors: [],
      schedules: [],
      doorIndex: -1,
      filteredSchedules: [],
      groupWithScheduleNames: {},
    };
  },
  methods: {
    getFilteredSchedules(text) {
      this.filteredSchedules = !text.length
        ? this.schedules.map(({ name }) => name)
        : this.schedules
            .filter(({ name }) => {
              return name.toLowerCase().indexOf(text.toLowerCase()) >= 0;
            })
            .map(({ name }) => name);
    },
    submit() {
      const group = {
        ...this.groupWithScheduleNames,
        schedules: this.groupWithScheduleNames.schedules.map(
          (name) => this.schedules.find((g) => g.name === name).id
        ),
      };
      this.$axios
        .$post("/group", {
          ...group,
        })
        .then(() => {
          this.$emit("close");
        })
        .catch((e) => this.$refs.form.validation(e));
    },
    remove() {
      this.$axios
        .$delete(`group/${this.group.id}`)
        .then(() => this.$emit("close"))
        .catch((e) => {
          console.error(e);
        });
    },
  },
  components: {
    formModal,
  },
  mounted() {
    Promise.all([
      this.$axios.$get("/door"),
      this.$axios.$get("/schedule"),
    ]).then(([doors, schedules]) => {
      this.doors = doors;
      this.schedules = schedules;
      console.log("group", this.group);

      // const accessArray = Object.entries(this.group.doorAccess).reduce(
      //   (acc, [doorId, scheduleId]) => {
      //     const schedule = this.schedules.find(
      //       (schedule) => schedule.id === scheduleId
      //     );
      //     const door = this.doors.find((door) => door.id === doorId);
      //     if (!schedule || !door) return acc;

      //     acc.doors.push(door.name);
      //     acc.schedules.push(schedule.name);
      //     return acc;
      //   },
      //   {
      //     schedules: [],
      //     doors: [],
      //   }
      // );
      const accessArray =this.doors.reduce(
        (acc, {id, name}) => {
          const scheduleId= this.group.doorAccess[id];
          const schedule = this.schedules.find(
            (schedule) => schedule.id === scheduleId
          );
          const scheduleName = schedule? schedule.name : '';
          acc.doors.push(name);
          acc.schedules.push(scheduleName);
          return acc;
        },
        {
          schedules: [],
          doors: [],
        }
      );

      this.groupWithScheduleNames = {
        ...this.group,
        schedules: accessArray.schedules,
        doors: accessArray.doors,
      };
      this.getFilteredSchedules("");
    });
  },
};
</script>

<style >
.button-section {
  justify-content: space-between;
  display: flex;
  flex-wrap: wrap;
}
</style>
