export default {
  name: "ElementsDisplayMixin",
  data() {
    return {
      elements: [],
      filteredElements: [],
      elementsToFilter: [],
      groups: [],
      selectedElement: null,
    };
  },
  watch: {
    elements: function(newElements) {
      this.elementsToFilter = this.getElementsToFilter(newElements);
    },
  },
  methods: {
    getElementsToFilter(elements) {
      return elements;
    },
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
