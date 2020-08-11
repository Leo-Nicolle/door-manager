<template>
  <div class="schedules">
    <table>
      <thead>
        <tr>
          <th>Nom</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(schedule, i) in schedules" :key="i" @click="onScheduleClick(schedule)">
          <td>{{ schedule.name }}</td>
        </tr>
      </tbody>
    </table>
    <button @click="onAddSchedule()">Ajouter Schedule</button>
    <Modal v-if="selectedSchedule">
      <Schedule :schedule="selectedSchedule" @cancel="onCancel()" />
    </Modal>
  </div>
</template>

<script>
import Schedule from "./Schedule";
import Modal from "./Modal";
import axios from "axios";
import { getUrl } from "../js/utils";

export default {
  name: "Schedules",
  data() {
    return {
      selectedSchedule: null,
      schedules: [],
    };
  },
  methods: {
    onScheduleClick(schedule) {
      this.selectedSchedule = schedule;
    },
    onAddSchedule() {
      this.selectedSchedule = {
        name: "",
        days: new Array(7).fill(0).map(() => [
          {
            start: null,
            end: null,
            allDay: false,
          },
        ]),
      };
    },
    onCancel() {
      this.selectedSchedule = null;
    },
  },
  mounted() {
    axios.get(getUrl("schedule")).then(({ data }) => (this.schedules = data));
  },

  components: {
    Schedule,
    Modal,
  },
};
</script>
<style>
</style>
