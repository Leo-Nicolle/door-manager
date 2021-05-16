<template>
  <div>
    <table-view :columns="columns" :route="'/log'"  />
  </div>
</template>

<script>
import TableView from "../../components/tableView.vue";
import dateformat from "dateformat";

export default {
  name: "logPage",
  computed: {
    columns: function () {
      return [
        {
          field: "date",
          searchable: true,
          label: "Date",
          format: (date) => dateformat(date, "dd/mm/yy--HH:mm"),
          sortable: true,
          width: "40",
        },
        {
          field: "door",
          searchable: true,
          format: (id) => this.getDoorName(id),
          sortable: true,
          label: "Porte",
          width: "40",
        },
        {
          field: "authorized",
          format: (auth) =>
            `<p  class="${auth ? 'has-text-success' : 'has-text-danger'}">${
              auth ? "oui" : "non"
            }</p>`,
          sortable: true,
          searchable: true,
          centered: true,
          label: "Autorisée",
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
    TableView,
  },
  mounted() {
    this.$axios.$get("/door").then((doors) => {
      this.doors = doors;
    });
  },
};
</script>
