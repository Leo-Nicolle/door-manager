<template>
  <div class="users">
    <ElementsDisplay
      :elements="elements"
      :selectedElement="selectedElement"
      @queryResult="onQueryResult"
      @add="onAddElement"
    >
      <tr slot="headers">
        <th>Nom</th>
        <th>Prenom</th>
        <th>Badges</th>
        <th>Groupes</th>
      </tr>
      <tr slot="body" v-for="(user, i) in filteredElements" :key="i" @click="onElementClick(user)">
        <td>{{ user.lastname }}</td>
        <td>{{ user.firstname }}</td>
        <td>TODO</td>
        <td>{{ getGroups(user.groups) }}</td>
      </tr>
      <User slot="form" :user="selectedElement" @cancel="onCancel()" @submit="onSubmit()" />
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
    };
  },
  mixins: [ElementsDisplayMixin],
  methods: {
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
    getGroups(ids) {
      return ids
        .map((id) => {
          const group = this.groups.find((group) => group.id === id);
          return group ? group.name : null;
        })
        .filter((e) => e)
        .join(" ");
    },
    fetch() {
      axios.get(getUrl("user")).then(({ data }) => {
        this.elements = data;
      });
      axios.get(getUrl("group")).then(({ data }) => (this.groups = data));
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
