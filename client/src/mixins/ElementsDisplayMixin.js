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
      const sorted =  this.filteredElements
        .slice()
        .sort((a,b) => this.compare(a,b));
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
    getIcon(fieldname){
      return this.sortBy === fieldname 
        ? this.order > 0 
        ? '\uEA02'
        : '\uEA03'
        : '\uEA01';
    },
    compare(a,b){
      if(!this.sortBy)return 0;
      const aSortBy = a[this.sortBy];
      const bSortBy = b[this.sortBy];

      if(aSortBy.constructor === Array){
        return aSortBy[0]   
        .localeCompare(bSortBy[0])* this.order;
      }
      if(typeof aSortBy === 'string'){
        return aSortBy   
        .localeCompare(bSortBy)* this.order;
      }else{
        return (aSortBy - bSortBy)* this.order;
      }
    },
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
