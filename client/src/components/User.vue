<template>
  <form v-if="user">
    <div class="body">
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
      <label class="long-input">
        Groupes
        <VoerroTagsInput
          v-model="selectedGroups"
          :existing-tags="groupTags"
          :typeahead="true"
        />
      </label>
      <label class="long-input">
        Badges
        <button class="validate small-button">+</button>

        <button
          class="delete small-button"
          v-for="(uuid, i) in user.badges"
          :key="i"
        >
          {{ uuid }}
        </button>
      </label>
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
import VoerroTagsInput from "@voerro/vue-tagsinput";
import encrypt from "quick-encrypt";

export default {
  name: "User",
  props: {
    user: null,
  },
  data() {
    return {
      invalidFields: [],
      groups: [],
      groupTags: [],
      selectedGroups: [],
    };
  },
  watch: {
    user: function() {
      this.fetchGroups().then(() => this.updateSelectedGroups());
    },
  },
  methods: {
    updateSelectedGroups() {
      if (!this.user) return;
      this.selectedGroups = this.getGroups(this.user.groups);
      this.groupTags = this.groups.map((group) => ({ value: group.name }));
    },
    getClass(fieldName) {
      return this.invalidFields.find((f) => f === fieldName) ? "invalid" : "";
    },
    fetchGroups() {
      return axios.get(getUrl("group")).then(({ data }) => {
        this.groupTags = data.map(({ name }) => ({ value: name }));
        this.groups = data;
      });
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
          this.user.password = encrypt.encrypt(this.user.password, publicKey);
        })
        .then(() => axios.post(getUrl("user"), this.user))
        .then(() => {
          this.$emit("submit");
        })
        .catch((e) => {
          if (!e.response.data) return console.error(e);
          console.log("response error", e.response.data.errors);
          this.invalidFields = e.response.data.errors.map(({ param }) => param);
        });
    },
    onCancel() {
      this.$emit("cancel");
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
  mounted() {
    this.fetchGroups().then(() => this.updateSelectedGroups());
  },
  components: {
    VoerroTagsInput,
  },
};
</script>
<style>
.invalid {
  background: #f00;
}
form {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  margin: 20px;
  width: 100%;
}
.body {
  min-width: 310px;
  max-width: 500px;
  align: center;
}

label {
  margin: 12px 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.footer {
  min-width: calc(100% - 20px);
  max-width: calc(100% - 20px);
  display: flex;
  justify-content: space-between;
}
.long-input {
}
.small-button {
  max-height: 1em;
  line-height: 0;
  padding: 1em 0.5em;
  max-width: fit-content;
}
</style>
