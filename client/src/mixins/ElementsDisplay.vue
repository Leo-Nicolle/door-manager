<template>
  <div class="elements">
    <SearchBar :elements="elementsToFilter" @queryResult="onQueryResult" />
    <table>
      <thead>
        <slot name="headers"></slot>
      </thead>
      <tbody>
        <slot name="body"></slot>
      </tbody>
    </table>
    <button @click="$emit('add')">Ajouter</button>
    <Modal v-if="selectedElement">
      <slot name="form"></slot>
    </Modal>
  </div>
</template>

<script>
import Modal from "../components/Modal";
import SearchBar from "../components/SearchBar";

export default {
  name: "ElementsDisplay",
  props: ["elements", "elementsToFilter", "selectedElement"],
  methods: {
    onAddElement() {
      console.log("todo");
    },
    onElementClick(element) {
      this.selectedElement = element;
    },
    onQueryResult(results) {
      this.$emit("queryResult", results);
    },
    onCancel() {
      this.selectedElement = null;
    },
    onSubmit() {
      this.selectedElement = null;
    },
  },
  components: {
    Modal,
    SearchBar,
  },
  mounted() {},
};
</script>
<style>
table {
  width: 100%;
}

th {
  background: #000;
  color: #fff;
}
tr {
  cursor: pointer;
}
tr:nth-of-type(odd) {
  background: #ccc;
}
tr:hover {
  background: #ddd;
}
</style>
