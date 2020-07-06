<template>
  <div class="users">
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Prenom</th>
          <th>Badges</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, i) in users" :key="i" @click="onUserClick(user)">
          <td>{{ user.lastname }}</td>
          <td>{{ user.firstname }}</td>
          <td>TODO</td>
        </tr>
      </tbody>
    </table>
    <button @click="onAddUser()">Ajouter Utilisateur</button>
    <Modal v-if="selectedUser">
      <User :user="selectedUser" @cancel="onCancel()" />
    </Modal>
  </div>
</template>

<script>
import User from "./User";
import Modal from "./Modal";

export default {
  name: "Users",
  data() {
    return {
      selectedUser: null,
    };
  },
  props: ["users"],
  methods: {
    onUserClick(user) {
      this.selectedUser = user;
    },
    onAddUser() {
      this.selectedUser = {
        firstname: "",
        lastname: "",
        groups: [],
      };
    },
    onCancel() {
      this.selectedUser = null;
    },
  },
  components: {
    User,
    Modal,
  },
};
</script>
<style>
table {
  width: 100%;
}

th {
  background: #000;
  color: #fff;
}
tr {
  cursor: pointer;
}
tr:nth-of-type(odd) {
  background: #ccc;
}
tr:hover {
  background: #ddd;
}
</style>
