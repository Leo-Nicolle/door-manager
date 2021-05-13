<template>
    <item-view :route="route" :columns="columns" :selectable="false">
    </item-view>
  </section>
</template>

<script>
import ItemView from "../../components/itemView.vue";
import dateformat from "dateformat";

export default {
  name: "logPage",
  computed: {
    columns: function () {
      return [
        {
          field: "date",
          label: "Date",
          format: (date) => dateformat(date, "dd/mm/yy--HH:mm"),
          sortable: true,
          width: "40",
        },
        {
          field: "door",
          format: (id) => this.getDoorName(id),
          sortable: true,
          label: "Porte",
          width: "40",
        },
      ];
    },
  },
  data() {
    return {
      route: "/log",
      doors: [],
    };
  },
  methods: {
    getDoorName(id) {
      const door = this.doors.find((d) => d.id === id);
      if (!door) return "Porte inconnue";
      return door.name;
    },
  },
  components: {
    ItemView,
  },
  mounted() {
    this.$axios.$get("/door").then((doors) => {
      this.doors = doors;
    });
  },
};
</script>
