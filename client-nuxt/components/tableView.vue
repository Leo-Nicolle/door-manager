<template>
  <section class="section">
    <b-table
      :bordered="true"
      :striped="true"
      :hoverable="true"
      :paginated="true"
      :data="transformedItems"
      :columns="columns"
      @select="onSelect"
    ></b-table>
  </section>
</template>

<script>
export default {
  name: "tableView",
  props: {
    route: { type: String },
    columns: { type: Array },
    selectable: { type: Boolean, default: () => true },
  },
  computed: {
    transformedItems: function () {
      const transform = this.columns.filter((c) => c.format);
      return this.items.map((i) => {
        const item = {...i}
        transform.forEach(
          ({ field, format }) => (item[field] = format(item[field]))
        );
        return item;
      });
    },
  },
  data() {
    return {
      selectedItem: null,
      items: [],
    };
  },
  methods: {
    onSelect(item) {
      if (!this.selectable) return;
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
