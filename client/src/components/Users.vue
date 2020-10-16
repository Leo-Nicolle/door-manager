<template>
  <div class="users">
    <ElementsDisplay
      :elements="elements"
      :selectedElement="selectedElement"
      :elementsToFilter="elementsToFilter"
      @queryResult="onQueryResult"
      @add="onAddElement"
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
      <tr slot="body" v-for="(user, i) in sortedElements" :key="i" @click="onElementClick(user)">
        <td>{{ user.lastname }}</td>
        <td>{{ user.firstname }}</td>
        <td>{{ user.groupNames.join(' ') }}</td>
      </tr>
      <User slot="form" :element="selectedElement" @cancel="onCancel()" @submit="onSubmit()" />
    </ElementsDisplay>
  </div>
</template>

<script>
import User from "./User";
import axios from "axios";
import { getUrl } from "../js/utils";
import ElementsDisplay from "../mixins/ElementsDisplay";
import ElementsDisplayMixin from "../mixins/ElementsDisplayMixin.js";

export default {
  name: "Users",
  data() {
    return {
      groups: [],
       headers: [
          {title: 'Nom', key: 'lastname'},
          {title: 'Prenom', key: 'firstname'},
          {title: 'Groupes', key: 'groupNames'},
      ]
    };
  },
  mixins: [ElementsDisplayMixin],
  methods: {
    getElementsToFilter(elements) {
      return elements.map((user) => {
        const groupNames = user.groups.map(
          (groupId) => this.groups.find(({ id }) => id === groupId).name
        );
        return {
          ...user,
          groupNames,
        };
      });
    },
    onAddElement() {
      this.selectedElement = {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        isAdmin: false,
        groups: [],
        badges: [],
      };
    },
    fetch() {
      axios
        .get(getUrl("group"))
        .then(({ data }) => (this.groups = data))
        .then(() => axios.get(getUrl("user")))
        .then(({ data }) => {
          this.elements = data;
        });
    },
  },
  components: {
    User,
    ElementsDisplay,
  },
};
</script>
<style>
</style>
