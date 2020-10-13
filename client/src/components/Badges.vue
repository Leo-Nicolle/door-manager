<template>
  <div class="badges">
    <ElementsDisplay
      :elements="elements"
      :selectedElement="selectedElement"
      :elementsToFilter="elementsToFilter"
      @queryResult="onQueryResult"
      @add="onAddElement"
    >
      <tr slot="headers">
        <th>firstname</th>
        <th>lastname</th>
        <th>uuid</th>
      </tr>
      <tr
        slot="body"
        v-for="(badge, i) in sortedElements"
        :key="i"
        @click="onElementClick(badge)"
      >
        <td @click="onHeaderClick('firstname')">{{ badge.firstname }}</td>
        <td @click="onHeaderClick('lastname')">{{ badge.lastname }}</td>
        <td @click="onHeaderClick('badge')">{{ badge.badge }}</td>
      </tr>
      <Badge slot="form" :element="selectedElement" :users="users" @cancel="onCancel()" />
    </ElementsDisplay>
  </div>
</template>

<script>
import axios from "axios";
import { getUrl } from "../js/utils";
import Badge from "./Badge";
import ElementsDisplay from "../mixins/ElementsDisplay";
import ElementsDisplayMixin from "../mixins/ElementsDisplayMixin.js";

export default {
  name: "Badges",
  data() {
    return {
      users: [],
    };
  },
  mixins: [ElementsDisplayMixin],
  methods: {
    onAddElement() {
      this.selectedElement = {
        uuid: "",
      };
    },
    fetch() {
      axios.get(getUrl("user")).then(({ data }) => {
        this.users = data;
        this.elements = this.users.reduce((acc, user) => {
          user.badges.forEach((badge) => {
            acc.push({
              ...user,
              badge,
            });
          });
          return acc;
        }, []);
        console.log("elements", this.elements);
      });
    },
  },
  components: {
    Badge,
    ElementsDisplay,
  },
};
</script>
<style>
</style>
