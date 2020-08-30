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
        <button class="validate small-button" @click="onStartAddBadge()">+</button>
        <button
          class="delete small-button"
          v-for="(uuid, i) in user.badges"
          :key="i"
          @click="onDeleteBadge($event, uuid)"
        >{{ uuid.slice(0,6) }}</button>
      </label>
      <Confirm
        :visible="isAddingBadge"
        :message="addingBadgeMessage"
        @confirm="onConfirmAddBadge"
        @cancel="onCancelAddBadge"
      />
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
import Confirm from "./Confirm";

export default {
  name: "User",
  data() {
    return {
      groups: [],
      groupTags: [],
      selectedGroups: [],
      isAddingBadge: false,
      addingBadgeMessage: "",
      requestNewBadgeTimeout: null,
      newBadgeUuid: null,
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
    onConfirmAddBadge() {
      if (this.newBadgeUuid) {
        this.user.badges = this.user.badges.concat(this.newBadgeUuid);
      }
      this.onCancelAddBadge();
    },
    onCancelAddBadge() {
      clearInterval(this.requestNewBadgeTimeout);
      this.newBadgeUuid = null;
      this.isAddingBadge = false;
    },
    onStartAddBadge() {
      this.addingBadgeMessage = "En attente de scan du badge";
      this.isAddingBadge = true;
      this.requestNewBadgeTimeout = setInterval(() => {
        axios
          .get(getUrl("newbadge"))
          .then(({ data }) => {
            if (!data) return;
            this.newBadgeUuid = data;
            this.addingBadgeMessage = `UUID: ${data}`;
            clearInterval(this.requestNewBadgeTimeout);
          })
          .catch((e) => console.error(e));
      }, 500);
    },
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
        .delete(getUrl(`user/${this.user.id}`))
        .then(() => this.$emit("submit"))
        .catch((e) => {
          console.error(e);
        });
    },
    onDeleteBadge(event, uuid) {
      event.stopPropagation();
      event.preventDefault();
      this.user.badges = this.user.badges.filter((badge) => badge !== uuid);
    },
  },
  components: {
    VoerroTagsInput,
    Confirm,
    Form,
  },
};
</script>
<style>
</style>
