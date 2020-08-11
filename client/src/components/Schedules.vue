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

export default {
  name: "Schedules",
  data() {
    return {
      selectedSchedule: null,
    };
  },
  props: ["schedules"],
  methods: {
    onScheduleClick(schedule) {
      this.selectedSchedule = schedule;
    },
    onAddSchedule() {
      this.selectedSchedule = {
        firstname: "",
        lastname: "",
        schedules: [],
      };
    },
    onCancel() {
      this.selectedSchedule = null;
    },
  },
  components: {
    Schedule,
    Modal,
  },
};
</script>
<style>
</style>
