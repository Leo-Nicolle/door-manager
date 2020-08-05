<template>
  <form v-if="group">
    <div class="body">
      <label>
        nom de famille
        <input
          :class="getClass('name')"
          type="text"
          v-model="group.name"
          id="name"
          name="name"
          required
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

export default {
  name: "Group",
  props: {
    group: null,
  },
  data() {
    return {
      invalidFields: [],
    };
  },
  watch: {
    group: function () {
      this.fetchGroups();
    },
  },
  methods: {
    getClass(fieldName) {
      return this.invalidFields.find((f) => f === fieldName) ? "invalid" : "";
    },
    fetchGroups() {
      axios
        .get(getUrl("group"))
        .then(
          ({ data }) =>
            (this.groups = data.map(({ name }) => ({ value: name })))
        )
        .then(() => console.log("groups", this.groups));
    },
    onSubmit(event) {
      axios
        .post(getUrl("group"), this.group)
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
        .delete(getUrl("group"), this.group)
        .then(({ data }) => console.log("deleted", data))
        .catch((e) => {
          console.error(e);
        });
    },
  },
  mounted() {
    this.fetchGroups();
  },
  components: {},
};
</script>
<style>
</style>
