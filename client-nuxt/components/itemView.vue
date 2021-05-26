<template>
  <section class="section">
    <section v-if="!item">
      <slot name="buttons" />
      <b-button
        v-if="newButton"
        label="Nouveau"
        @click="$router.push(routeNew)"
        type="is-success"
        class="is-pulled-right"
      />
      <table-view
        :columns="columns"
        :refreshFrequency="refreshFrequency"
        :route="route"
      />
    </section>
    <slot v-else name="default" :item="item" />
  </section>
</template>

<script>
import tableView from "./tableView";

export default {
  name: "itemView",
  props: {
    route: String,
    columns: Array,
    refreshFrequency: Number,
    newButton: {default: true },
  },
  data() {
    return {
      item: null,
    };
  },
  computed: {
    routeNew: function () {
      return `${this.route}/new`;
    },
  },
  components: {
    tableView,
  },
  mounted() {
    const id = this.$route.params.id;
    if (!id) return;
    this.$axios
      .$get(`${this.route}/${id}`)
      .then((item) => {
        this.item = item;
      })
      .catch((error) => {
        console.log("error", error);
      });
  },
};
</script>
