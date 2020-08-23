<template>
  <div class="doors">
    <ElementsDisplay
      :elements="elements"
      :selectedElement="selectedElement"
      @queryResult="onQueryResult"
      @add="onAddElement"
    >
      <tr slot="headers">
        <th>Nom</th>
      </tr>
      <tr slot="body" v-for="(door, i) in filteredElements" :key="i" @click="onElementClick(door)">
        <td>{{ door.name }}</td>
      </tr>
      <Door slot="form" :element="selectedElement" @cancel="onCancel()" @submit="onSubmit()" />
    </ElementsDisplay>
  </div>
</template>

<script>
import Door from "./Door";
import { getUrl } from "../js/utils";
import axios from "axios";
import ElementsDisplay from "../mixins/ElementsDisplay";
import ElementsDisplayMixin from "../mixins/ElementsDisplayMixin.js";

export default {
  name: "Doors",
  mixins: [ElementsDisplayMixin],
  methods: {
    onAddElement() {
      this.selectedElement = {
        name: "",
      };
    },
    fetch() {
      axios.get(getUrl("door")).then(({ data }) => {
        this.elements = data;
      });
    },
  },
  components: {
    Door,
    ElementsDisplay,
  },
};
</script>
<style>
</style>
