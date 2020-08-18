export default {
  name: "ElementsDisplayMixin",
  data() {
    return {
      elements: [],
      filteredElements: [],
      groups: [],
      selectedElement: null,
    };
  },
  methods: {
    onElementClick(element) {
      this.selectedElement = element;
    },
    onQueryResult(results) {
      this.filteredElements = results;
    },
    onAddElement() {
      console.log("TODO");
    },
    onCancel() {
      this.selectedElement = null;
    },
    onSubmit() {
      this.selectedElement = null;
      this.fetch();
    },
    fetch() {
      console.log("TODO");
    },
  },
  mounted() {
    this.fetch();
  },
};
