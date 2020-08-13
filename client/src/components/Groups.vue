<template>
  <div class="groups">
    <table>
      <thead>
        <tr>
          <th>Nom</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(group, i) in groups" :key="i" @click="onGroupClick(group)">
          <td>{{ group.name }}</td>
        </tr>
      </tbody>
    </table>
    <button @click="onAddGroup()">Ajouter Group</button>
    <Modal v-if="selectedGroup">
      <Group :group="selectedGroup" :doors="doors" @cancel="onCancel()" />
    </Modal>
  </div>
</template>

<script>
import Group from "./Group";
import Modal from "./Modal";
import { getUrl } from "../js/utils";
import axios from "axios";

export default {
  name: "Groups",
  data() {
    return {
      selectedGroup: null,
      doors: [],
      groups: [],
    };
  },
  methods: {
    onGroupClick(group) {
      this.selectedGroup = group;
    },
    onAddGroup() {
      this.selectedGroup = {
        name: "",
        doorAccess: this.doors.reduce((doorAcces, { id }) => {
          doorAcces[id] = "";
          return doorAcces;
        }, {}),
      };
    },
    fetchDoors() {
      axios.get(getUrl("door")).then(({ data }) => (this.doors = data));
    },
    fetchGroups() {
      axios.get(getUrl("group")).then(({ data }) => (this.groups = data));
    },

    onCancel() {
      this.selectedGroup = null;
    },
  },
  mounted() {
    this.fetchDoors();
    this.fetchGroups();
  },
  components: {
    Group,
    Modal,
  },
};
</script>
<style>
</style>
