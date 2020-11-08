<template>
<Form :element="element" :onSubmit="onSubmit" :onDelete="onDelete" :onCancel="onCancel">
  <div slot="body">
    <label>
      nom de famille
      <input :class="getClass('lastname')" type="text" v-model="user.lastname" id="lastname" name="lastname" required />
    </label>
    <label>
      Prenom
      <input :class="getClass('firstname')" type="text" v-model="user.firstname" id="firstname" name="firstname" required />
    </label>
    <label>
      admin
      <input :class="getClass('isAdmin')" type="checkbox" v-model="user.isAdmin" id="isAdmin" name="isAdmin" @change='onAdminChange' required />
    </label>
    <label class="long-input">
      Groupes
      <Treeselect v-model="selectedGroups" :multiple="true" :options="groupTags" :typeahead="true" />
    </label>
    <label class="long-input">
      Badges
      <button class="validate small-button" @click="onStartAddBadge()">+</button>
      <button class="delete small-button" v-for="(uuid, i) in user.badges" :key="i" @click="onDeleteBadge($event, uuid)">{{ uuid.slice(0,6) }}</button>
    </label>
    <Confirm :visible="isAddingBadge" :message="addingBadgeMessage" @confirm="onConfirmAddBadge" @cancel="onCancelAddBadge" />
    <AdminModal 
      :element="element && adminModalVisible ? element : null" 
      @cancel="onAdminCancel()" 
      @submit="onAdminSubmit()" />
  </div>
</Form>
</template>

<script>
import {
  getUrl
} from "../js/utils";
import axios from "axios";
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import encrypt from "quick-encrypt";
import Form from "../mixins/Form";
import FormMixin from "../mixins/FormMixin";
import Confirm from "./Confirm";
import AdminModal from "./AdminModal";

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
      adminModalVisible: false
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
    onAdminChange(evt) {
      this.adminModalVisible = evt.target.checked;
    },
    onAdminCancel(){
      this.adminModalVisible = false;
    },
    onAdminSubmit(){
      this.adminModalVisible = false;
    },
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
          .then(({
            data
          }) => {
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
      this.selectedGroups = this.user.groups.slice();
      this.groupTags = this.groups.map(({
        name,
        id
      }) => ({
        id,
        label: name
      }));
    },
    fetch() {
      return axios
        .get(getUrl("group"))
        .then(({
          data
        }) => {
          this.groupTags = data.map(({
            name,
            id
          }) => ({
            id,
            label: name
          }));
          this.groups = data;
        })
        .then(() => this.updateSelectedGroups());
    },
    getGroups(ids) {
      return ids.map((id) => {
        const group = this.groups.find((group) => group.id === id)
        return {
          label: group.name,
          id: group.id
        }
      });
    },
    onSubmit(event) {
      event.preventDefault();
      event.stopPropagation();
      this.user.groups = this.selectedGroups.slice();
      axios
        .get(getUrl("encrypt"))
        .then(({
          data
        }) => {
          const publicKey = data;
          return this.user.isAdmin && this.user.password.length ?
            encrypt.encrypt(this.user.password, publicKey) :
            "";
        })
        .then((password) =>
          axios.post(getUrl("user"), {
            ...this.user,
            password
          })
        )
        .then(() => {
          this.$emit("submit");
        })
        .catch((e) => {
          if (!e.response.data) return console.error(e);
          console.log("response error", e.response.data.errors);
          this.invalidFields = e.response.data.errors.map(({
            param
          }) => param);
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
    Treeselect,
    Confirm,
    AdminModal,
    Form,
  },
};
</script>

<style>
</style>
