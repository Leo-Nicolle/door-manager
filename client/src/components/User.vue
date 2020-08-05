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
      <label class="long-input">
        Groupes
        <VoerroTagsInput
          v-model="selectedGroups"
          :existing-tags="groups"
          :typeahead="true"
        />
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

export default {
  name: "User",
  props: {
    user: null,
  },
  data() {
    return {
      invalidFields: [],
      groups: [],
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
      this.selectedGroups = this.user.groups.map((g) => ({ value: g }));
    },
    getClass(fieldName) {
      return this.invalidFields.find((f) => f === fieldName) ? "invalid" : "";
    },
    fetchGroups() {
      return axios
        .get(getUrl("group"))
        .then(
          ({ data }) =>
            (this.groups = data.map(({ name }) => ({ value: name })))
        );
    },
    onSubmit(event) {
      this.user.groups = this.selectedGroups.map(({ value }) => value);
      axios
        .post(getUrl("user"), this.user)
        .then(({ data }) => console.log("validated", data))
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
        .delete(getUrl("user"), this.user)
        .then(({ data }) => console.log("deleted", data))
        .catch((e) => {
          console.error(e);
        });
    },
  },
  mounted() {
    this.fetchGroups();
    this.updateSelectedGroups();
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
</style>
