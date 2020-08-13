<template>
  <form v-if="group">
    <div class="body">
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
    doors: [],
  },
  data() {
    return {
      invalidFields: [],
      schedules: [],
      indexDoor: 0,
    };
  },
  computed: {
    currentDoorAcces: {
      get: function () {
        return this.group.doorAccess[this.doors[this.indexDoor].id];
      },
      set: function (newValue) {
        this.group.doorAccess[this.doors[this.indexDoor].id] = newValue;
      },
    },
  },
  methods: {
    getClass(fieldName) {
      return this.invalidFields.find((f) => f === fieldName) ? "invalid" : "";
    },
    getDoorButtonClass(i) {
      return i === this.indexDoor ? "validate" : "";
    },

    onDoorClick(i, evt) {
      this.indexDoor = i;
      evt.stopPropagation();
      evt.preventDefault();
    },

    fetchSchedules() {
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
    this.fetchSchedules();
  },
};
</script>
<style>
</style>
