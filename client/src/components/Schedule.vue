<template>
  <Form :element="element" :onSubmit="onSubmit" :onDelete="onDelete" :onCancel="onCancel">
    <div slot="body" class="body large-body">
      <label>
        nom
        <input
          :class="getClass('name')"
          type="text"
          v-model="schedule.name"
          id="name"
          name="name"
          required
        />
      </label>
      <div class="large-form-container">
        <span class="date-container">
          <button
            v-for="(day,i) in days"
            :key="i"
            @click="onDayClick(i, $event)"
            :class="getDayButtonClass(i)"
          >{{day}}</button>
        </span>
      </div>
      <div>
        <label>
          <input type="checkbox" v-model="currentDay.allDay" />
          Toute la journee
        </label>
        <span
          class="date-container"
          :class="getDateContainerClass(indexDay)"
          v-for="(interval, j) in currentDay.intervals"
          :key="j"
        >
          <p>de</p>
          <TimePicker
            v-model="interval['start']"
            close-on-complete
            @change="onDatePicked(j)"
            :minute-interval="5"
          ></TimePicker>
          <p>a</p>
          <TimePicker
            v-model="interval['end']"
            close-on-complete
            @change="onDatePicked(j)"
            :minute-interval="5"
          ></TimePicker>
        </span>
      </div>
    </div>
  </Form>
</template>

<script>
import Form from "../mixins/Form";
import FormMixin from "../mixins/FormMixin";
import { getUrl } from "../js/utils";
import axios from "axios";
import TimePicker from "vue2-timepicker";
import "vue2-timepicker/dist/VueTimepicker.css";

export default {
  name: "Schedule",
  props: ["element"],
  mixins: [FormMixin],
  data() {
    return {
      indexDay: 0,
      testBool: false,
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
  computed: {
    currentDay: function () {
      return this.schedule.days[this.indexDay];
    },
    schedule: {
      get: function () {
        return this.element;
      },
      set: function (schedule) {
        this.element = schedule;
      },
    },
  },
  methods: {
    getDayButtonClass(i) {
      return i === this.indexDay ? "validate" : "";
    },
    getDateContainerClass(indexDay) {
      return this.schedule.days[indexDay].allDay ? "hidden" : "";
    },
    onDatePicked(j) {
      const intervals = this.currentDay.intervals;
      const { start, end } = intervals[intervals.length - 1];
      if (
        start &&
        end &&
        intervals.length === j + 1 &&
        start.HH &&
        start.mm &&
        end.HH &&
        end.mm
      ) {
        intervals.push({ start: null, end: null });
      }
    },
    onDayClick(i, evt) {
      this.indexDay = i;
      evt.stopPropagation();
      evt.preventDefault();
    },

    onSubmit(event) {
      console.log("testBool", this.testBool);
      axios
        .post(getUrl("schedule"), JSON.parse(JSON.stringify(this.schedule)))
        .then(() => this.$emit("submit"))
        .catch((e) => {
          if (!e.response.data) return console.error(e);
          console.log("response error", e.response.data.errors);
          this.invalidFields = e.response.data.errors.map(({ param }) => param);
          event.preventDefault();
        });
      console.log(event);
      event.preventDefault();
      event.stopPropagation();
    },
    onDelete() {
      axios
        .delete(getUrl(`schedule/${this.schedule.id}`))
        .then(() => this.$emit("submit"))
        .catch((e) => {
          console.error(e);
        });
    },
  },
  components: { TimePicker, Form },
};
</script>
<style>
.body.large-body {
  height: 80%;
}
.large-form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.date-container {
  min-width: min-content;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.date-container > button {
  margin: 0 5px;
  margin-bottom: 10px;
  max-width: 90px;
}
label {
  max-width: fit-content;
}
label > input {
  margin: 0 10px;
}
</style>
