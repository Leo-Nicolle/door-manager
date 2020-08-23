<template>
  <Form :element="element" :onSubmit="onSubmit" :onDelete="onDelete" :onCancel="onCancel">
    <div slot="body" class="body">
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
  </Form>
</template>

<script>
import { getUrl } from "../js/utils";
import axios from "axios";
import Form from "../mixins/Form";
import FormMixin from "../mixins/FormMixin";

export default {
  name: "Badge",
  props: ["users"],
  mixins: [FormMixin],
  data() {
    return {
      search: "",
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
    badge: {
      get: function () {
        return this.element;
      },
      set: function (badge) {
        this.element = badge;
      },
    },
  },
  methods: {
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
    onDelete() {
      axios
        .delete(getUrl(`badge/${this.badge.id}`))
        .then(() => this.$emit("submit"))
        .catch((e) => {
          console.error(e);
        });
    },
  },
  components: {
    Form,
  },
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
