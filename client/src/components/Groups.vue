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
      <Group :group="selectedGroup" @cancel="onCancel()" />
    </Modal>
  </div>
</template>

<script>
import Group from "./Group";
import Modal from "./Modal";

export default {
  name: "Groups",
  data() {
    return {
      selectedGroup: null,
    };
  },
  props: ["groups"],
  methods: {
    onGroupClick(group) {
      this.selectedGroup = group;
    },
    onAddGroup() {
      this.selectedGroup = {
        firstname: "",
        lastname: "",
        groups: [],
      };
    },
    onCancel() {
      this.selectedGroup = null;
    },
  },
  components: {
    Group,
    Modal,
  },
};
</script>
<style>
</style>
