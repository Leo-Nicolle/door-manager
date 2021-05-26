<template>
  <section>
    <item-view :route="route" :refreshFrequency="200" :columns="columns">
      <template v-slot:buttons>
        <b-button type="is-primary" @click="compile"> Compiler </b-button>
      </template>

      <template slot-scope="{ item }">
        <door-form :door="item" @close="$router.push(route)" />
      </template>
    </item-view>
  </section>
</template>

<script>
import ItemView from "../../components/itemView.vue";
import DoorForm from "../../components/doorForm.vue";

export default {
  name: "doorPage",
  data() {
    return {
      route: "/door",
      pingFrequency: 1,
      cleaning: false,
      columns: [
        {
          field: "name",
          label: "nom",
        },
        {
          field: "lastPing",
          label: "Actif",
          format: (date) => {
            const online = this.isOnline(date)
            return `<p  class="${
              online ? "has-text-success" : "has-text-danger"
            }">${online ? "oui" : "non"}</p>`;
          },
          customSearch: (door, query) => {
            const isOnline = this.isOnline(door.lastPing)
            return this.yesNo(query) ? isOnline : !isOnline;
          },
        },
      ],
    };
  },
  methods: {
    isOnline(date) {
      return (Date.now() - date) / (1000 * 60) < this.pingFrequency + 0.1;
    },
    compile() {
      this.$axios
        .$get("/code-compile")
        .then(() => {
          this.$buefy.toast.open({
            message: "Compilation reussie!",
            type: "is-success",
          });
        })
        .catch((e) => {
          this.$buefy.toast.open({
            message: e,
            type: "is-danger",
          });
        });
    },
  },
  mounted() {
    this.$axios.$get("/settings").then(({ doorDefaults }) => {
      this.pingFrequency = doorDefaults.pingFrequency;
    });
  },
  components: {
    DoorForm,
    ItemView,
  },
};
</script>
