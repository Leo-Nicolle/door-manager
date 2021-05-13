
import Vue from 'vue'
Vue.mixin({
  props: ["route", "columns"],
  data() {
    return {
      items: [],
      selectedItem: null
    };
  },
  methods: {
    onSelect(item) {
      this.$router.push(`${route}/${item.id}`)
    },
  },
  mounted() {
    this.$axios
      .$get(`${route}`)
      .then((items) => {
        this.items = items;
      })
      .catch((error) => {
        console.log("error", error);
      });
  },
});
