<template>
  <form v-if="schedule">
    <div class="body large-body">
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
          <input type="checkbox" v-model="schedule.days[indexDay].allDay" />
          Toute la journee
        </label>
        <span
          class="date-container"
          :class="getDateContainerClass(indexDay)"
          v-for="(interval, j) in schedule.days[indexDay]"
          :key="j"
        >
          <p>de</p>
          <TimePicker
            format="hh:mm"
            v-model="interval['start']"
            close-on-complete
            @change="onDatePicked(indexDay,j)"
          ></TimePicker>
          <p>a</p>
          <TimePicker
            format="hh:mm"
            v-model="interval['end']"
            close-on-complete
            @change="onDatePicked(indexDay,j)"
          ></TimePicker>
        </span>
      </div>
    </div>
    <div class="footer">
      <input class="validate" type="submit" value="valider" @click="onSubmit" />
      <button @click="onCancel">cancel</button>
      <input class="delete" type="submit" value="suprimer" @click="onDelete" />
    </div>
  </form>
</template>

<script>
import { getUrl } from "../js/utils";
import axios from "axios";
import TimePicker from "vue2-timepicker";
import "vue2-timepicker/dist/VueTimepicker.css";
export default {
  name: "Schedule",
  props: ["schedule"],
  data() {
    return {
      invalidFields: [],
      indexDay: 0,
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
    getDayButtonClass(i) {
      return i === this.indexDay ? "validate" : "";
    },
    getClass(fieldName) {
      return this.invalidFields.find((f) => f === fieldName) ? "invalid" : "";
    },
    getDateContainerClass(indexDay) {
      return this.schedule.days[indexDay].allDay ? "hidden" : "";
    },
    onDatePicked(i, j) {
      const intervals = this.schedule.days[i];
      const { start, end } = intervals[j];
      if (
        start &&
        end &&
        intervals.length === j + 1 &&
        start.hh &&
        start.mm &&
        end.hh &&
        end.mm
      ) {
        intervals.push({ start: null, end: null, allDay: false });
      }
    },
    onDayClick(i, evt) {
      this.indexDay = i;
      console.log(evt);
      evt.stopPropagation();
      evt.preventDefault();
    },

    onSubmit(event) {
      axios
        .post(getUrl("schedule"), JSON.parse(JSON.stringify(this.schedule)))
        .then(({ data }) => console.log("validated", data))
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
    onCancel() {
      this.$emit("cancel");
    },
    onDelete() {
      axios
        .delete(getUrl("schedule"), this.schedule)
        .then(({ data }) => console.log("deleted", data))
        .catch((e) => {
          console.error(e);
        });
    },
  },
  components: { TimePicker },
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
