<template>
  <Form :element="element" :onSubmit="onSubmit" :onDelete="onDelete" :onCancel="onCancel">
    <div slot="body" class="body">
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
            <label>
        ip
        <select
          :class="getClass('ip')"
          v-model="door.ip"
          id="ip"
          name="ip"
          required
        >
        <option v-for="(lock, i) in getLocks()" :key = "i"> {{lock.ip}}</option>
        </select>
      </label>
    </div>
  </Form>
</template>

<script>
import { getUrl } from "../js/utils";
import axios from "axios";
import Form from "../mixins/Form";
import FormMixin from "../mixins/FormMixin";

export default {
  name: "Door",
  mixins: [FormMixin],
  props: ['locks'],
  computed: {
    door: {
      get: function () {
        return this.element;
      },
      set: function (door) {
        this.element = door;
      },
    },
  },
  methods: {
    getLocks(){
      return [this.element].concat(
        this.locks.filter(lock => !lock.doorId));
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
    onDelete() {
      console.log("ICI delete", getUrl(`door/${this.door.id}`));
      axios
        .delete(getUrl(`door/${this.door.id}`))
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
</style>
