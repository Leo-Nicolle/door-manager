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
          :key="`${j}-${indexDay}`"
        >
          <p>de</p>
          <TimePicker
            v-model="interval['start']"
            close-on-complete
            @change="onDatePicked(j)"
            :minute-interval="5"
            :class="getTimePickerClass(0, j)"
            placeholder="heure de début"
          ></TimePicker>
          <p>a</p>
          <TimePicker
            v-model="interval['end']"
            close-on-complete
            @change="onDatePicked(j)"
            :minute-interval="5"
            :class="getTimePickerClass(1, j)"
            placeholder="heure de fin"
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
      errors: [],
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
      return (this.errors.find(
        ({ indexDay }) =>
          indexDay === i)
        ? "invalid"
        : "")
        + (i === this.indexDay 
        ? " validate" 
        : "");
    },
    getDateContainerClass(indexDay) {
      return this.schedule.days[indexDay].allDay ? "hidden" : "";
    },
    getTimePickerClass(position, j) {
      return this.errors.find(
        ({ indexDay, indexInterval, indexStartEnd }) =>
          indexDay === this.indexDay &&
          indexInterval === j &&
          position === indexStartEnd
      )
        ? "invalid"
        : "";
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
        intervals.push({ start: { HH: "", mm: "" }, end: { HH: "", mm: "" } });
      }
      this.validate()
      .then(() => {
            this.errors = [];
            this.invalidFields = []

      })
      .catch(e => { 
        if (!e.response.data) return console.error(e);
        console.log("response error", e.response.data.errors);
        const errors = e.response.data.errors;
        if(!errors.find(({indexDay}) => indexDay === this.indexDay)){
        // if there is no errors for today's dates, validate it
        this.errors = this.errors.filter(({indexDay})=> 
          indexDay !== undefined 
          && indexDay !== this.indexDay)
        }
      })
      this.$force
    },
    onDayClick(i, evt) {
      this.indexDay = i;
      if (!this.currentDay.intervals.length) {
        this.currentDay.intervals = this.currentDay.intervals.concat({
          start: { HH: "", mm: "" },
          end: { HH: "", mm: "" },
        });
      }
      evt.stopPropagation();
      evt.preventDefault();
    },
    validate(){
     return axios
        .post(getUrl("schedule/validate"), 
          JSON.parse(JSON.stringify(this.schedule)));
    },

    onSubmit(event) {
      this.errors = [];
      axios
      .post(getUrl("schedule"), JSON.parse(JSON.stringify(this.schedule)))
      .then(() => this.$emit('submit'))
      .catch((e) => {
        if (!e.response.data) return console.error(e);
        console.log("response error", e.response.data.errors);
        this.errors = e.response.data.errors;
        this.invalidFields = this.errors.filter((e) => e.param);
        return false;
      });
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
  min-width: max-content;
}
label {
  max-width: fit-content;
}
label > input {
  margin: 0 10px;
}
.invalid > input.display-time {
  border-color: #c03;
  outline-color: #c03;
}
button.invalid  {
  border: solid 2px #c03;
}
</style>
