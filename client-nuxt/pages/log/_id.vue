<template>
  <section>
    <item-view
      :route="route"
      :refreshFrequency="200"
      :columns="columns"
      :newButton="false"
    >
      <template v-slot:buttons>
        <b-button type="is-primary" @click="startArchiving">
          Archiver
        </b-button>
      </template>

      <template slot-scope="{ item }">
        <door-form :door="item" @close="$router.push(route)" />
      </template>
    </item-view>

    <b-modal
      :width="640"
      :active="archiving"
      style="z-index: 100"
      scroll="keep"
    >
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Archiver les logs</p>
          <button type="button" class="delete" @click="archiving = false" />
        </header>
        <section class="modal-card-body" style="padding: 12px 0">
          <div class="content" style="text-align: center">
            <div>
              <p>Archiver les logs plus vieux de:</p>
              <div
                class="button-section"
                style="margin: 0 6px; padding-bottom: 10px"
              >
                <b-button
                  v-for="(duration, i) in durations"
                  :key="i"
                  :type="`is-primary ${
                    i === selectedDuration ? 'is-light' : 'is-dark'
                  }`"
                  :focused="i === selectedDuration"
                  @click="selectedDuration = i"
                >
                  {{ duration.text }}
                </b-button>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot is-full">
          <b-button
            label="Valider"
            type="is-success"
            style="margin-left: auto"
            @click="onValidate()"
          />
        </footer>
      </div>
    </b-modal>
  </section>
</template>

<script>
import TableView from "../../components/tableView.vue";
import dateformat from "dateformat";

export default {
  name: "logPage",
  computed: {
    route: function () {
      return `/log${this.logsArchive ? "/before/" + this.logsArchive : ""}`;
    },
    columns: function () {
      return [
        {
          field: "date",
          label: "Date",
          format: (date) => dateformat(date, "dd/mm/yy--HH:mm"),
        },
        {
          field: "door",
          label: "Porte",
          format: (id) => this.getDoorName(id),
        },
        {
          field: "authorized",
          label: "Autorisée",
          format: (auth) =>
            `<p  class="${auth ? "has-text-success" : "has-text-danger"}">${
              auth ? "oui" : "non"
            }</p>`,
          customSearch: (log, query) => {
            return this.yesNo(query) ? log.authorized : !log.authorized;
          },
        },
      ];
    },
  },
  data() {
    return {
      archiving: false,
      sent: false,
      logsArchive: null,
      durations: [
        {
          name: "day",
          text: "un jour",
        },
        {
          name: "week",
          text: "une semaine",
        },
        {
          name: "month",
          text: "un mois",
        },
        {
          text: "ne pas archiver",
        },
      ],
      selectedDuration: 2,
      doors: [],
    };
  },
  methods: {
    getDoorName(id) {
      const door = this.doors.find((d) => d.id === id);
      if (!door) return "Porte inconnue";
      return door.name;
    },
    startArchiving() {
      this.selectedDuration = this.durations.reduce(
        (s, { name }, i) => (name === this.logsArchive ? i : s),
        3
      );
      this.archiving = true;
    },
    onValidate() {
      const newDuration = this.durations[this.selectedDuration].name;
      if (!newDuration) {
        localStorage.removeItem("logsArchive");

      } else {
        localStorage.setItem("logsArchive", newDuration);
      }
      this.logsArchive = localStorage.getItem("logsArchive");
      this.archiving = false;
    },
  },
  components: {
    TableView,
  },
  mounted() {
    this.logsArchive = localStorage.getItem("logsArchive");
    this.$axios.$get("/door/").then((doors) => {
      this.doors = doors;
    });
  },
};
</script>
