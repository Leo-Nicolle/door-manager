<template>
    <item-view :route="route" :columns="columns">
      <template slot-scope="{item}">
        <door-form :door="item" @close="$router.push(route)" />
      </template>
    </item-view>
  </section>
</template>

<script>
import ItemView from '../../components/itemView.vue';
import DoorForm from "../../components/doorForm.vue";

export default {
  name: "doorPage",
  data() {
    return {
      route: "/door",
      columns: [
        {
          field: "name",
          searchable: true,
          label: "nom",
          width: "40",
        },
      ],
    };
  },
  components: {
    DoorForm,
    ItemView,
  },
};
</script>
