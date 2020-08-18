<template>
  <div class="users">
    <SearchBar :elements="users" @queryResult="onQueryResult" />
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Prenom</th>
          <th>Badges</th>
          <th>Groupes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, i) in filteredUsers" :key="i" @click="onUserClick(user)">
          <td>{{ user.lastname }}</td>
          <td>{{ user.firstname }}</td>
          <td>TODO</td>
          <td>{{ getGroups(user.groups) }}</td>
        </tr>
      </tbody>
    </table>
    <button @click="onAddUser()">Ajouter Utilisateur</button>
    <Modal v-if="selectedUser">
      <User :user="selectedUser" @cancel="onCancel()" @submit="onSubmit()" />
    </Modal>
  </div>
</template>

<script>
import User from "./User";
import Modal from "./Modal";
import axios from "axios";
import { getUrl } from "../js/utils";
import SearchBar from "./SearchBar";

export default {
  name: "Users",
  data() {
    return {
      users: [],
      filteredUsers: [],
      groups: [],
      selectedUser: null,
    };
  },
  methods: {
    onUserClick(user) {
      this.selectedUser = user;
    },
    onQueryResult(results) {
      this.filteredUsers = results;
    },
    onAddUser() {
      this.selectedUser = {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        isAdmin: false,
        groups: [],
        badges: [],
      };
    },
    onCancel() {
      this.selectedUser = null;
    },
    onSubmit() {
      this.selectedUser = null;
    },
    getGroups(ids) {
      return ids
        .map((id) => {
          const group = this.groups.find((group) => group.id === id);
          return group ? group.name : null;
        })
        .filter((e) => e)
        .join(" ");
    },
  },
  components: {
    User,
    Modal,
    SearchBar,
  },
  mounted() {
    axios.get(getUrl("user")).then(({ data }) => (this.users = data));
    axios.get(getUrl("group")).then(({ data }) => (this.groups = data));
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
