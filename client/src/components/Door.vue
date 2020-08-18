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
      axios
        .delete(getUrl("door"), this.door)
        .then(({ data }) => console.log("deleted", data))
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
