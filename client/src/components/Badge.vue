<template>
  <form v-if="badge">
    <div class="body">
      <label>
        uuid
        <input
          :class="getClass('name')"
          type="text"
          v-model="badge"
          id="uuid"
          uuid="uuid"
          required
        />
      </label>
      <div>
        <label>
          Utilisateur
          <input type="text" v-model="search" placeholder="Utilisateur..." />
        </label>
        <div v-if="!selectedUser" class="name-list" :class="getUsersClass()">
          <div
            v-for="(user,i) in filteredUsers"
            :key="i"
            @click="onUserClick(user)"
          >{{user.firstname}} {{user.lastname}}</div>
        </div>
        <div v-if="selectedUser">
          <button
            @click="onSelectedUserClick()"
          >{{selectedUser.firstname}} {{selectedUser.lastname}}</button>
        </div>
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

export default {
  name: "Badge",
  props: {
    badge: null,
    users: [],
  },
  data() {
    return {
      search: "",
      invalidFields: [],
      selectedUser: null,
    };
  },
  computed: {
    filteredUsers: function () {
      const f = this.users.filter(
        ({ lastname, firstname, email }) =>
          lastname.includes(this.search) ||
          firstname.includes(this.search) ||
          email.includes(this.search)
      );
      return new Array(20).fill(0).map(() => f[0]);
    },
  },
  methods: {
    getClass(fieldName) {
      return this.invalidFields.find((f) => f === fieldName) ? "invalid" : "";
    },
    getUsersClass() {
      return this.selectedUser ? "hidden" : "";
    },
    getSelectedUserClass() {
      return this.selectedUser ? "" : "hidden";
    },

    onUserClick(user) {
      this.selectedUser = user;
    },
    onSelectedUserClick() {
      this.selectedUser = null;
    },
    onSubmit(event) {
      if (!this.selectedUser) return;
      this.selectedUser.badges.push(this.badge.uuid);
      axios
        .post(getUrl("user"), this.selectedUser)
        .then(() => this.$emit("submit"))
        .catch((e) => {
          if (!e.response.data) return console.error(e);
          console.log("response error", e.response.data.errors);
          this.invalidFields = e.response.data.errors.map(({ param }) => param);
          event.preventDefault();
        });
    },
    onCancel() {
      this.$emit("cancel");
    },
    onDelete() {
      axios
        .delete(getUrl("badge"), this.badge)
        .then(({ data }) => console.log("deleted", data))
        .catch((e) => {
          console.error(e);
        });
    },
  },
  mounted() {},
};
</script>
<style>
.name-list {
  max-height: 200px;
  overflow-y: scroll;
  cursor: pointer;
}

.name-list > div:hover {
  background: pointer;
  background: #ddd;
}
</style>
