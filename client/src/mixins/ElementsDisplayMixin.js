export default {
  name: "ElementsDisplayMixin",
  data() {
    return {
      sortBy: '',
      order: 1,
      elements: [],
      filteredElements: [],
      elementsToFilter: [],
      groups: [],
      selectedElement: null,
    };
  },
  computed: {
    sortedElements: function(){
      console.log('sort')
      const sorted =  this.filteredElements
        .slice()
        .sort((a,b) => {
          if(!this.sortBy)return 0;
          return a[this.sortBy]   
          .localeCompare( b[this.sortBy])* this.order;
        });
        console.log(sorted.map(e => e[this.sortBy]))
        return sorted;
    }
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
    onHeaderClick(sortBy) {
      if(this.sortBy === sortBy){
        this.order *=-1;
      }else{
        this.sortBy = sortBy;
        this.order = 1;
      }
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
