<template>
  <section class="section">
    <b-table
      :bordered="true"
      :striped="true"
      :hoverable="true"
      :paginated="true"
      :data="items"
      @select="onSelect"
    >
      <b-table-column
        v-for="(c, i) in columns"
        :key="i"
        :field="c.field"
        :label="c.label"
        :width="c.width || 40"
        :sortable="c.sortable === false ? false : true"
        :centered ="c.centered === false ? false : true"
        :searchable="c.searchable === false ? false : true"
        :custom-search ="c.customSearch" 
        @filters-change="evt => console.log('change', evt)"
        v-slot="props"
      >
        <span
          v-html="c.format ? c.format(props.row[c.field]) : props.row[c.field]"
        ></span>
      </b-table-column>
    </b-table>
  </section>
</template>

<script>
export default {
  name: "tableView",
  props: {
    route: { type: String },
    columns: { type: Array },
    selectable: { type: Boolean, default: () => true },
    refreshFrequency: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      selectedItem: null,
      items: [],
      refreshInterval: null,
    };
  },
  methods: {
    onSelect(item) {
      if (!this.selectable) return;
      this.selectedItem = item;
      this.$router.push(`${this.route}/${item.id}`);
    },
    fetch() {
      this.$axios
        .$get(`${this.route}`)
        .then((items) => {
          this.items = items;
        })
        .catch((error) => {
          console.error("error", error);
        });
    },
  },
  mounted() {
    if (this.refreshFrequency > 0) {
      this.refreshInterval = setInterval(
        () => this.fetch(),
        this.refreshFrequency
      );
    }
    this.fetch();
  },
  destroyed() {
    clearInterval(this.refreshInterval);
  },
};
</script>

<style>
tbody > tr {
  cursor: pointer;
}
</style>>
