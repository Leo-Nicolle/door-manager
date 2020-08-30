<template>
  <div class="groups">
    <ElementsDisplay
      :elements="elements"
      :selectedElement="selectedElement"
      :elementsToFilter="elementsToFilter"
      @queryResult="onQueryResult"
      @add="onAddElement"
    >
      <tr slot="headers">
        <th>Nom</th>
      </tr>
      <tr
        slot="body"
        v-for="(group, i) in filteredElements"
        :key="i"
        @click="onElementClick(group)"
      >
        <td>{{ group.name }}</td>
      </tr>
      <Group
        slot="form"
        :doors="doors"
        :element="selectedElement"
        @cancel="onCancel()"
        @submit="onSubmit()"
      />
    </ElementsDisplay>
  </div>
</template>

<script>
import Group from "./Group";
import { getUrl } from "../js/utils";
import axios from "axios";
import ElementsDisplay from "../mixins/ElementsDisplay";
import ElementsDisplayMixin from "../mixins/ElementsDisplayMixin.js";

export default {
  name: "Groups",
  data() {
    return {
      doors: [],
    };
  },
  mixins: [ElementsDisplayMixin],
  methods: {
    onAddElement() {
      this.selectedElement = {
        name: "",
        doorAccess: this.doors.reduce((doorAcces, { id }) => {
          doorAcces[id] = "";
          return doorAcces;
        }, {}),
      };
    },
    fetch() {
      axios.get(getUrl("door")).then(({ data }) => (this.doors = data));
      axios.get(getUrl("group")).then(({ data }) => (this.elements = data));
    },
  },
  components: {
    Group,
    ElementsDisplay,
  },
};
</script>
<style>
</style>
