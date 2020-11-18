
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
          <Treeselect class= "caped-width getClass('currentDoorAcces')" 
          v-model="currentDoorAcces" 
          :multiple="false" 
          :options="treeSchedules" 
          :typeahead="true" />
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
import Treeselect from '@riophae/vue-treeselect'

export default {
  name: "Group",
  props: ["doors"],
  data() {
    return {
      schedules: [],
      errorResponses: [],
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
    treeSchedules: function(){
      return this.schedules.map(({id, name}) => ({id, label: name}))
    }
  },
  watch: {
    errorResponses: function (newValue) {
      if (!newValue) return;
      newValue.forEach((msg) => {
        if (msg.includes("schedule"))
          this.invalidFields = this.invalidFields.concat("currentDoorAcces");
      });
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
      event.preventDefault();
      event.stopPropagation();
      axios
        .post(getUrl("group"), this.group)
        .then(() => this.$emit("submit"))
        .catch((e) => {
          if (!e.response.data) return console.error(e);
          console.log("response error", e.response.data.errors);
          this.errorResponses = e.response.data.errors.map(({ msg }) => msg);
          event.preventDefault();
        });
    },
    onDelete() {
      axios
        .delete(getUrl(`group/${this.group.id}`))
        .then(() => this.$emit("submit"))
        .catch((e) => {
          console.error(e);
        });
    },
  },
  components: {
    Form,
    Treeselect,
  },
};
</script>
<style>
</style>
