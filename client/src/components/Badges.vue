<template>
  <div class="badges">
    <ElementsDisplay
      :elements="elements"
      :selectedElement="selectedElement"
      @queryResult="onQueryResult"
      @add="onAddElement"
    >
      <tr slot="headers">
        <th>uuid</th>
      </tr>
      <tr
        slot="body"
        v-for="(badge, i) in filteredElements"
        :key="i"
        @click="onElementClick(badge)"
      >
        <td>{{ badge }}</td>
      </tr>
      <Badge slot="form" :badge="selectedElement" :users="users" @cancel="onCancel()" />
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
        this.elements = Object.keys(
          data.reduce((acc, { badges }) => {
            badges.forEach((badge) => (acc[badge] = 1));
            return acc;
          }, {})
        );
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
