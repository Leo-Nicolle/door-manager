<template>
  <form v-if="door">
    <div class="body">
      <label>
        nom
        <input
          :class="getClass('name')"
          type="text"
          v-model="door.name"
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
  name: "Door",
  props: {
    door: null,
  },
  data() {
    return {
      invalidFields: [],
    };
  },
  watch: {
    door: function () {
      this.fetchDoors();
    },
  },
  methods: {
    getClass(fieldName) {
      return this.invalidFields.find((f) => f === fieldName) ? "invalid" : "";
    },
    onSubmit(event) {
      axios
        .post(getUrl("door"), this.door)
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
        .delete(getUrl("door"), this.door)
        .then(({ data }) => console.log("deleted", data))
        .catch((e) => {
          console.error(e);
        });
    },
  },
};
</script>
<style>
</style>
