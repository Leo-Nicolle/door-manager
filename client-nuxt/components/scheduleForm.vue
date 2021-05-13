<template>
  <form-modal
    ref="form"
    :title="$route.params.id === 'new' ? 'Nouvel Horraire' : `${schedule.name}`"
    :item="schedule"
    :schema="schema"
    @submit="submit"
    @remove="remove"
    @close="$emit('close')"
  >
    <template v-slot:days>
      <section class="button-section">
        <b-button
          v-for="(day, i) in days"
          :key="i"
          @click="
            dayIndex = i;
            currentDay = schedule.days[i];
          "
          :type="getButtonType(i)"
          >{{ day }}</b-button
        >
      </section>
    </template>
    <template v-slot:allDay>
      <b-checkbox
        rounded
        v-model="currentDay.allDay"
        style="margin-top: 0.75rem"
        :locale="'fr-FR'"
        hour-format="24"
      >
        Tout le temps
      </b-checkbox>
    </template>
    <template v-slot:times>
      <b-field
        v-for="(c, i) in currentDatesPerDay"
        style="margin-top: 0.75rem"
        :key="`dates-${i}`"
        :type="getPickerType(i)"
      >
        <b-clockpicker
          v-if="!isAllDay"
          placeholder="Heure de début"
          icon="clock"
          hours-label="Heures"
          v-model="c.start"
          :locale="'fr-FR'"
          hour-format="24"
        />
        <b-clockpicker
          v-if="!isAllDay"
          currentDatesPerDay
          placeholder="Heure de fin"
          icon="clock"
          hours-label="Heures"
          v-model="c.end"
          :locale="'fr-FR'"
          hour-format="24"
        />
      </b-field>
    </template>
  </form-modal>
</template>

<script>
import formModal from "./formModal";

export default {
  name: "ScheduleForm",
  props: ["schedule"],
  computed: {
    currentDatesPerDay: function () {
      return this.datesPerDay[this.dayIndex];
    },
    isAllDay: function () {
      return this.currentDay && this.currentDay.allDay;
    },
    schema: function () {
      return {
        fields: [
          {
            label: "Nom",
            model: "name",
            type: "name",
          },
          {
            type: "slot",
            name: "days",
          },
          {
            type: "slot",
            name: "allDay",
            condition: () => this.currentDay,
          },
          {
            type: "field-slot",
            name: "times",
            condition: () => this.currentDay,
          },
        ],
        required: ["name"],
      };
    },
  },
  data() {
    return {
      startTime: null,
      dayIndex: -1,
      currentDay: "",
      days: [
        "lundi",
        "mardi",
        "mercredi",
        "jeudi",
        "vendredi",
        "samedi",
        "dimanche",
      ],
    };
  },
  methods: {
    getButtonType(i) {
      const invalid = this.invalidFields.find(({ param }) =>
        param.includes(`day${i}`)
      );
      return invalid
        ? "is-danger"
        : `is-primary ${i === this.dayIndex ? "is-light" : "is-dark"}`;
    },
    getPickerType(i) {
      const invalid = this.invalidFields.find(({ param }) =>
        param.includes(`day${this.dayIndex}-schedule${i}`)
      );
      return invalid ? "is-danger" : "";
    },
    generateDate(hours = 0) {
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(0);
      return date;
    },
    formatDate(date) {
      const [HH, mm] = date.toTimeString().split(" ")[0].split(":");
      return { HH, mm };
    },
    submit() {
      const schedule = {
        ...this.schedule,
      };
      this.$axios
        .$post("/schedule", {
          ...schedule,
          days: this.datesPerDay.map((intervals, i) => {
            const allDay = this.schedule.days[i].allDay;
            if (allDay)
              return {
                allDay,
                intervals: [],
              };
            return {
              allDay,
              intervals: intervals.map(({ start, end }) => ({
                start: this.formatDate(start),
                end: this.formatDate(end),
              })),
            };
          }),
        })
        .then(() => {
          this.$emit("close");
        })
        .catch((e) => {
          this.$refs.form.validation(e);
          this.validation(e);
        });
    },
    remove() {
      this.$axios
        .$delete(`schedule/${this.schedule.id}`)
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
    this.datesPerDay = this.schedule.days.map(({ intervals }) => {
      return intervals
        .map(({ start, end }) => {
          const startDate = new Date();
          const endDate = new Date();
          startDate.setHours(start.HH);
          startDate.setMinutes(start.mm);
          endDate.setHours(end.HH);
          endDate.setMinutes(end.mm);
          return { start: startDate, end: endDate };
        })
        .concat({
          start: this.generateDate(),
          end: this.generateDate(1),
        });
    });
  },
};
</script>

<style >
.button-section {
  justify-content: space-between;
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.75rem;
}
</style>
