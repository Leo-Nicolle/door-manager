<template>
  <ElementsDisplay
    :elements="elements"
    :selectedElement="selectedElement"
    @queryResult="onQueryResult"
    @add="onAddElement"
    class="schedules"
  >
    <tr slot="headers">
      <th>Nom</th>
    </tr>
    <tr
      slot="body"
      v-for="(schedule, i) in filteredElements"
      :key="i"
      @click="onElementClick(schedule)"
    >
      <td>{{ schedule.name }}</td>
    </tr>
    <Schedule slot="form" :element="selectedElement" @cancel="onCancel()" @submit="onSubmit()" />
  </ElementsDisplay>
</template>

<script>
import { getUrl } from "../js/utils";
import axios from "axios";
import Schedule from "./Schedule";
import ElementsDisplay from "../mixins/ElementsDisplay";
import ElementsDisplayMixin from "../mixins/ElementsDisplayMixin.js";

export default {
  name: "Schedules",
  mixins: [ElementsDisplayMixin],
  methods: {
    onAddSchedule() {
      this.selectedElement = {
        name: "",
        days: new Array(7).fill(0).map(() => ({
          allDay: false,
          intervals: [{ start: null, end: null }],
        })),
      };
    },
    fetch() {
      axios.get(getUrl("schedule")).then(({ data }) => (this.elements = data));
    },
  },
  components: {
    Schedule,
    ElementsDisplay,
  },
};
</script>
<style>
</style>
