
<template>
  <Form :element="element" :onSubmit="onSubmit" :onDelete="onDelete" :onCancel="onCancel">
    <div slot="body" class="body">
      <label>
        nom
        <input
          :class="getClass('name')"
          type="text"
          v-model="group.name"
          id="name"
          name="name"
          required
        />
      </label>
      <div class="large-form-container">
        <span class="date-container">
          <button
            v-for="(door,i) in doors"
            :key="i"
            @click="onDoorClick(i, $event)"
            :class="getDoorButtonClass(i)"
          >{{door.name}}</button>
        </span>
      </div>
      <div>
        <label>
          Horraire
          <select type="select" v-model="currentDoorAcces">
            <option
              v-for="(schedule, j) in schedules"
              :key="j"
              :value="schedule.id"
            >{{schedule.name}}</option>
          </select>
        </label>
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
  name: "Group",
  props: ["doors"],
  data() {
    return {
      schedules: [],
      indexDoor: 0,
    };
  },
  mixins: [FormMixin],
  computed: {
    currentDoorAcces: {
      get: function () {
        return this.group.doorAccess[this.doors[this.indexDoor].id];
      },
      set: function (newValue) {
        this.group.doorAccess[this.doors[this.indexDoor].id] = newValue;
      },
    },
    group: {
      get: function () {
        return this.element;
      },
      set: function (group) {
        this.element = group;
      },
    },
  },
  methods: {
    getDoorButtonClass(i) {
      return i === this.indexDoor ? "validate" : "";
    },

    onDoorClick(i, evt) {
      this.indexDoor = i;
      evt.stopPropagation();
      evt.preventDefault();
    },

    fetch() {
      axios.get(getUrl("schedule")).then(({ data }) => (this.schedules = data));
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
    onDelete() {
      axios
        .delete(getUrl("group"), this.group)
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
