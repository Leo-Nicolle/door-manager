<template>
  <span class="search-bar">
    <div class="search-container">
      <i class="icon-search"></i>
      <input type="search" name="search" v-model="query" placeholder="Search..." />
      <!-- <input type="submit" value="Search" class="searchButton" /> -->
    </div>
  </span>
</template>

<script>
import Levensthein from 'levenshtein';
export default {
  name: "SearchBar",
  props: ["elements"],
  data() {
    return {
      query: "",
      filteredElements: [],
    };
  },
  methods: {
    matchQuery(query, string) {
      return query
        .split(" ")
        .filter((query) => query.length)
        .reduce((score, query) => score + +string.includes(query) 
        + string
          .split(' ')
          .filter(split => split.length)
          .reduce((score, splited) => score + +splited.includes(query) +1 / Math.max(1, Levensthein(query, splited)), 0) 
        , 0);
    },
    match(object, query) {
      return (
        object &&
        Object.entries(object).reduce((score,[fieldname, field]) => {
          if(fieldname === 'date'){
            return score 
            + this.matchQuery(
              query,
              new Date(+field).format('DD/MM/YY--HH:mm')
              )
          }
          if (typeof field === "object") {
            return score + this.match(field, query);
          }
          if (typeof field === "string") {
            return score + this.matchQuery(query, field);
          }
          if (typeof field === "number") {
            return score + this.matchQuery(query, Number(field).toString(10));
          }
          return score;
        }, 0)
      );
    },
    update(query) {
      if (!query.length) {
        this.filteredElements = this.elements;
        return;
      }
      const elementsAndScore =  this.elements
        .map((element) => [element, this.match(element, query)])
        .filter(([, score]) => score)
        .sort(([, a], [, b]) => b - a);
      const scoreThreshold = elementsAndScore[0][1] * 0.8;
      console.log(elementsAndScore)
      this.filteredElements = elementsAndScore
        .filter(([, score]) => score> scoreThreshold)
        .map(([element]) => element);
    },
  },
  watch: {
    query: function (newQuery) {
      this.update(newQuery);
    },
    elements: function () {
      this.update(this.query);
    },
    filteredElements: function (newElements) {
      this.$emit("queryResult", newElements);
    },
  },

  components: {},
  mounted() {
    this.update(this.query);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search-container {
  display: inline-flex;
  flex: 1 1 300px;
  position: relative;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
}
</style>
