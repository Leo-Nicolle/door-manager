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
        IP
        <Treeselect class= "caped-width getClass('ip')" 
        v-model="door.ip" 
        :multiple="false" 
        :options="treeIps" 
        :typeahead="true" />
      </label>

       <label>
        SSID
         <input
          :class="getClass('ssid')"
          type="text"
          v-model="door.ssid"
          id="ssid"
          required
        />
      </label>

        <label>
          wifipassword
         <input
          :class="getClass('password')"
          type="password"
          v-model="door.password"
          id="wifipassword"
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
import Treeselect from '@riophae/vue-treeselect'
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
    treeIps: function(){
      const a =  this.locks
        .filter(lock => !lock.doorId)
        .map(({ ip }) => ({label: ip, id: ip}));
      console.log(a);
      return a;
    }
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
    Treeselect,
  },
};
</script>
<style>
</style>
