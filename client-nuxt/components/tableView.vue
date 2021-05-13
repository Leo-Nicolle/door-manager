<template>
  <section class="section">
    <b-table
      :bordered="true"
      :striped="true"
      :hoverable="true"
      :paginated="true"
      :data="items"
      :columns="columns"
      @select="onSelect"
    ></b-table>
  </section>
</template>

<script>
export default {
  name: "tableView",
  props: ['route', "columns"],
  data() {
    return {
      selectedItem: null,
      items: [],
    };
  },
  methods: {
    onSelect(item) {
      this.selectedItem = item;
      this.$router.push(`${this.route}/${item.id}`);
    },
  },
  mounted() {

    this.$axios
      .$get(`${this.route}`)
      .then((items) => {
        this.items = items;
      })
      .catch((error) => {
        console.error("error", error);
      });
  },
};
</script>
