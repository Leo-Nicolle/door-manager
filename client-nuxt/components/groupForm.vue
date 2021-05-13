<template>
  <form-modal
    ref="form"
    :title="
      $route.params.id === 'new'
        ? 'Nouveau Groupe'
        : `${group.name}`
    "
    :item="group"
    :filteredData="filteredSchedules"
    :schema="schema"
    @submit="submit"
    @remove="remove"
    @close="$emit('close')"
  >
    <template v-slot:schedules>
      <b-autocomplete
        rounded
        v-model="schedulePerDoor[doorIndex]"
        style="margin-bottom: 85px;"
        :data="filteredSchedules"
        icon="clock-time-four-outline"
        placeholder="Choisir un horraire"
        clearable
        @typing="getFilteredSchedules"
      >
      </b-autocomplete>
    </template>
  </form-modal>
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
            type: "slot",
            condition: () => this.doorIndex >= 0,
            name: "schedules",
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
      schedulePerDoor: [],
      doorIndex: -1,
      filteredSchedules: [],
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
        ...this.group,
        doorAccess: this.schedulePerDoor.reduce(
          (doorAccess, scheduleName,i) =>{
             const schedule = this.schedules.find((g) => g.name === scheduleName)
             if(!schedule) return doorAccess;
             const doorId = this.doors[i].id
             doorAccess[doorId] = schedule.id
             return doorAccess;
          }
        ,{}),
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

      this.schedulePerDoor = this.doors.reduce(
        (schedulePerDoor, { id }) => {
          const scheduleId = this.group.doorAccess[id];
          const schedule = this.schedules.find(
            (schedule) => schedule.id === scheduleId
          );
          const scheduleName = schedule ? schedule.name : "";
          schedulePerDoor.push(scheduleName);
          return schedulePerDoor;
        },
          [],
      );
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
