<template>
  <div class="logs">
    <ElementsDisplay
      :elements="elements"
      :selectedElement="selectedElement"
      @queryResult="onQueryResult"
      @add="onAddElement"
    >
      <tr slot="headers">
        <th>Prenom</th>
        <th>Nom</th>
        <th>Porte</th>
        <th>Date</th>
      </tr>
      <tr slot="body" v-for="(log, i) in computedLogs" :key="i" @click="onElementClick(log)">
        <td>{{ log.firstname }}</td>
        <td>{{ log.lastname }}</td>
        <td>{{ log.doorName }}</td>
        <td>{{ new Date(log.date).format('DD/MM/YY--HH:mm') }}</td>
      </tr>
      <!-- <Log slot="form" :element="selectedElement" @cancel="onCancel()" @submit="onSubmit()" /> -->
    </ElementsDisplay>
  </div>
</template>

<script>
import { getUrl } from "../js/utils";
import axios from "axios";
import ElementsDisplay from "../mixins/ElementsDisplay";
import ElementsDisplayMixin from "../mixins/ElementsDisplayMixin.js";

export default {
  name: "Logs",
  mixins: [ElementsDisplayMixin],
  data() {
    return {
      computedLogs: [],
      users: [],
      doors: [],
    };
  },
  watch: {
    filteredElements: function (newValue) {
      this.computedLogs = newValue.map((log) => {
        const user = this.users.find(({ badges }) =>
          badges.includes(log.badge)
        );
        const door = this.doors.find(({ id }) => id === log.door);
        console.log(user, door);
        return {
          ...log,
          firstname: user.firstname,
          lastname: user.lastname,
          doorName: door.name,
        };
      });
    },
  },
  methods: {
    onAddElement() {},
    fetch() {
      axios
        .get(getUrl("user"))
        .then(({ data }) => {
          this.users = data;
        })
        .then(() => axios.get(getUrl("door")))
        .then(({ data }) => {
          this.doors = data;
        })
        .then(() => axios.get(getUrl("log")))
        .then(({ data }) => {
          this.elements = data;
        });
    },
  },
  components: {
    ElementsDisplay,
  },
};
</script>
<style>
</style>
