<template>
  <section class="section">
    <section v-if="!item">
      <b-button
        label="Nouveau"
        @click="$router.push(routeNew)"
        type="is-success"
        class="is-pulled-right"
      />
      <table-view :columns="columns" :route="route" />
    </section>
    <slot v-else :item="item" />
  </section>
</template>

<script>
import tableView from './tableView'

export default {
  name: "itemView",
  props: ["route","columns"],
  data() {
    return {
      item: null,
    };
  },
  computed: {
    routeNew: function(){
      return `${this.route}/new`
    }
  },
  components: {
    tableView
  },
  mounted() {
    const id = this.$route.params.id;
    console.log('mounted', this.route, id)
    if (!id) return;
    this.$axios
      .$get(`${this.route}/${this.$route.params.id}`)
      .then((item) => {
        console.log('Item ici', item)
        this.item = item;
      })
      .catch((error) => {
        console.log("error", error);
      });
  },
};
</script>
