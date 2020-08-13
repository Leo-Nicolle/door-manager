<template>
  <div class="badges">
    <table>
      <thead>
        <tr>
          <th>uuid</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(badge, i) in badges" :key="i" @click="onBadgeClick(badge)">
          <td>{{ badge }}</td>
        </tr>
      </tbody>
    </table>
    <button @click="onAddBadge()">Ajouter Badge</button>
    <Modal v-if="selectedBadge">
      <Badge :badge="selectedBadge" :users="users" @cancel="onCancel()" />
    </Modal>
  </div>
</template>

<script>
import Badge from "./Badge";
import Modal from "./Modal";
import { getUrl } from "../js/utils";
import axios from "axios";

export default {
  name: "Badges",
  data() {
    return {
      selectedBadge: null,
      doors: [],
      badges: [],
      users: [],
    };
  },
  methods: {
    onBadgeClick(badge) {
      this.selectedBadge = badge;
    },
    onAddBadge() {
      this.selectedBadge = {
        uuid: "",
      };
    },
    fetchUsers() {
      axios.get(getUrl("user")).then(({ data }) => {
        this.users = data;
        this.badges = Object.keys(
          data.reduce((acc, { badges }) => {
            badges.forEach((badge) => (acc[badge] = 1));
            return acc;
          }, {})
        );
      });
    },

    onCancel() {
      this.selectedBadge = null;
    },
  },
  mounted() {
    this.fetchUsers();
  },
  components: {
    Badge,
    Modal,
  },
};
</script>
<style>
</style>
