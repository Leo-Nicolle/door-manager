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
    onAddDoor() {
      this.selectedDoor = {
        name: "",
        id: "",
      };
    },
    fetch() {
      axios.get(getUrl("door")).then(({ data }) => {
        this.elements = data;
      });

      axios
        .get(getUrl("access/9d1d68a3-83b0-469b-a33b-db0eba69cc59"))
        .then(({ data }) => {
          console.log("Ici2", data);
        })
        .catch((e) => console.error(e));
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
