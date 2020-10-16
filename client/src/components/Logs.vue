<template>
  <div class="logs">
    <ElementsDisplay
      :elements="elements"
      :elementsToFilter="elementsToFilter"
      :selectedElement="selectedElement"
      :buttonText="`Supprimer`"
      @queryResult="onQueryResult"
      @add="onDeleteLogs"
    >
      <tr slot="headers">
        <th v-for="(header,i) in headers"
          :key= "i"
          @click = "onHeaderClick(header.key)"
        >
          <span>{{header.title}}</span> 
          <span class ="icon" >{{getIcon(header.key)}}</span>
        </th>
      </tr>
      <tr slot="body" v-for="(log, i) in sortedElements" :key="i" @click="onElementClick(log)">
        <td>{{ log.firstname }}</td>
        <td>{{ log.lastname }}</td>
        <td>{{ log.doorName }}</td>
        <td>{{ new Date(log.date).format('DD/MM/YY--HH:mm') }}</td>
        <td :class="+log.authorized === 200? 'open':'closed'"></td>
      </tr>
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
      users: [],
      doors: [],
      headers: [
          {title: 'Prenom', key: 'firstname'},
          {title: 'Nom', key: 'lastname'},
          {title: 'Porte', key: 'doorName'},
          {title: 'Date', key: 'date'},
          {title: 'Authorisée', key: 'authorized'}
      ]
    };
  },
  methods: {
    onDeleteLogs() {
      axios.delete(getUrl("log")).then(() => this.fetch());
    },
    onElementClick() {},
    getElementsToFilter(elements) {
      return elements.map((log) => {
        const user = this.users.find(({ badges }) =>
          badges.includes(log.badge)
        );
        const door = this.doors.find(({ id }) => id === log.door);
        return {
          ...log,
          firstname: user.firstname,
          lastname: user.lastname,
          doorName: door.name,
        };
      });
    },
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
