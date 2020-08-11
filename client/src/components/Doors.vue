<template>
  <div class="doors">
    <table>
      <thead>
        <tr>
          <th>Nom</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(door, i) in doors" :key="i" @click="onDoorClick(door)">
          <td>{{ door.name }}</td>
        </tr>
      </tbody>
    </table>
    <button @click="onAddDoor()">Ajouter Door</button>
    <Modal v-if="selectedDoor">
      <Door :door="selectedDoor" @cancel="onCancel()" />
    </Modal>
  </div>
</template>

<script>
import Door from "./Door";
import Modal from "./Modal";
import axios from "axios";
import { getUrl } from "../js/utils";
export default {
  name: "Doors",
  data() {
    return {
      selectedDoor: null,
      doors: [],
    };
  },
  methods: {
    onDoorClick(door) {
      this.selectedDoor = door;
    },
    onAddDoor() {
      this.selectedDoor = {
        name: "",
      };
    },
    onCancel() {
      this.selectedDoor = null;
    },
  },
  mounted() {
    axios.get(getUrl("door")).then(({ data }) => {
      console.log("data", data);
      this.doors = data;
    });
  },
  components: {
    Door,
    Modal,
  },
};
</script>
<style>
</style>
