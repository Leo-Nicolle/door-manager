<template>
    <item-view :route="route" :columns="columns">
      <template slot-scope="{item}">
        <group-form :group="item" @close="$router.push(route)" />
      </template>
    </item-view>
  </section>
</template>

<script>
import ItemView from '../../components/itemView.vue';
import GroupForm from "../../components/groupForm.vue";

export default {
  name: "groupPage",
  data() {
    return {
      route: "/group",
      columns: [
        {
          field: "name",
          label: "nom",
        },
      ],
    };
  },
  components: {
    GroupForm,
    ItemView,
  },
};
</script>
