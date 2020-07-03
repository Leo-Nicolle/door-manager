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
    <User :user="selectedUser" />
  </div>
</template>

<script>
import User from "./User";

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
  },
  components: {
    User,
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

tr:nth-of-type(odd) {
  background: #ccc;
}
</style>
