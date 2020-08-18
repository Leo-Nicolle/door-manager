<template>
  <Form :element="element" :onSubmit="onSubmit" :onDelete="onDelete" :onCancel="onCancel">
    <div slot="body">
      <label>
        nom de famille
        <input
          :class="getClass('lastname')"
          type="text"
          v-model="user.lastname"
          id="lastname"
          name="lastname"
          required
        />
      </label>
      <label>
        Prenom
        <input
          :class="getClass('firstname')"
          type="text"
          v-model="user.firstname"
          id="firstname"
          name="firstname"
          required
        />
      </label>
      <label>
        admin
        <input
          :class="getClass('isAdmin')"
          type="checkbox"
          v-model="user.isAdmin"
          id="isAdmin"
          name="isAdmin"
          required
        />
      </label>
      <div :class="user.isAdmin ?'' : 'hidden' ">
        <label>
          email
          <input
            :class="getClass('email')"
            type="text"
            v-model="user.email"
            id="email"
            name="email"
            required
          />
        </label>
        <label>
          password
          <input
            :class="getClass('password')"
            type="password"
            v-model="user.password"
            id="password"
            name="password"
            required
          />
        </label>
      </div>
      <label class="long-input">
        Groupes
        <VoerroTagsInput v-model="selectedGroups" :existing-tags="groupTags" :typeahead="true" />
      </label>
      <label class="long-input">
        Badges
        <button class="validate small-button">+</button>
        <button class="delete small-button" v-for="(uuid, i) in user.badges" :key="i">{{ uuid }}</button>
      </label>
    </div>
  </Form>
</template>

<script>
import { getUrl } from "../js/utils";
import axios from "axios";
import VoerroTagsInput from "@voerro/vue-tagsinput";
import encrypt from "quick-encrypt";
import Form from "../mixins/Form";
import FormMixin from "../mixins/FormMixin";

export default {
  name: "User",
  data() {
    return {
      groups: [],
      groupTags: [],
      selectedGroups: [],
    };
  },
  mixins: [FormMixin],
  computed: {
    user: {
      get: function () {
        return this.element;
      },
      set: function (user) {
        this.element = user;
      },
    },
  },
  methods: {
    updateSelectedGroups() {
      if (!this.user) return;
      this.selectedGroups = this.getGroups(this.user.groups);
      this.groupTags = this.groups.map((group) => ({ value: group.name }));
    },
    fetch() {
      return axios
        .get(getUrl("group"))
        .then(({ data }) => {
          this.groupTags = data.map(({ name }) => ({ value: name }));
          this.groups = data;
        })
        .then(() => this.updateSelectedGroups());
    },
    getGroups(ids) {
      return ids.map((id) => ({
        value: this.groups.find((group) => group.id === id).name,
      }));
    },
    onSubmit(event) {
      event.preventDefault();
      event.stopPropagation();
      this.user.groups = this.selectedGroups.map(
        ({ value }) => this.groups.find((group) => group.name === value).id
      );
      axios
        .get(getUrl("encrypt"))
        .then(({ data }) => {
          const publicKey = data;
          return this.user.admin && this.user.password.length
            ? encrypt.encrypt(this.user.password, publicKey)
            : "";
        })
        .then((password) =>
          axios.post(getUrl("user"), { ...this.user, password })
        )
        .then(() => {
          this.$emit("submit");
        })
        .catch((e) => {
          if (!e.response.data) return console.error(e);
          console.log("response error", e.response.data.errors);
          this.invalidFields = e.response.data.errors.map(({ param }) => param);
        });
    },
    onDelete() {
      axios
        .delete(getUrl("user"), this.user)
        .then(({ data }) => console.log("deleted", data))
        .catch((e) => {
          console.error(e);
        });
    },
  },
  components: {
    VoerroTagsInput,
    Form,
  },
};
</script>
<style>
</style>
