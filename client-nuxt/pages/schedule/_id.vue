<template>
  <section>
    <item-view :route="route" :columns="columns">
      <template slot-scope="{ item }">
        <schedule-form :schedule="item" @close="$router.push(route)" />
      </template>
    </item-view>
  </section>
</template>

<script>
import ItemView from "../../components/itemView.vue";
import ScheduleForm from "../../components/scheduleForm.vue";

export default {
  name: "schedulePage",
  data() {
    return {
      route: "/schedule",
      columns: [
        {
          field: "name",
          label: "nom",
          width: "40",
        },
      ],
    };
  },
  components: {
    ScheduleForm,
    ItemView,
  },
};
</script>
