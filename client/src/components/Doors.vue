<template>
  <div class="doors">
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
      axios
        .get(getUrl("door"))
        .then(({ data }) => {
          this.elements = data;
        })
        .then(() => {
          //   axios.get(getUrl(`access/${this.elements[1].id}/dsadsadsa`)).then(({ data }) => {
          //     console.log('should succeed',data)
          // });

          axios
            .get(getUrl(`access/${this.elements[1].id}/badges1`))
            .then(({ data }) => {
              console.log("should succeed", data);
            });

          axios
            .get(getUrl(`access/${this.elements[1].id}/badge2`))
            .then(({ data }) => {
              console.log("should fail", data);
            });
          // axios.get(getUrl(`access/${this.elements[1].id}/badge not exits`)).then(({ data }) => {
          //     console.log('should fail',data)
          // });

          //  axios.get(getUrl(`access/door not exist/hdisfidsfhdsi`)).then(({ data }) => {
          //     console.log('should fail',data)
          // });
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
