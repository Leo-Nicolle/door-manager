<template>
  <b-modal :width="640" :active="active" style="z-index: 100" scroll="keep">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Assigner une porte</p>
        <button v-if="!waiting" type="button" class="delete" @click="close" />
      </header>
      <section class="modal-card-body" style="padding: 12px 0">
        <div class="content padded" style="text-align: center">
          <h2>
            {{
              !waiting && !error
                ? "Choisir une porte"
                : waiting
                ? "Assignation..."
                : "Une erreur est survenue:"
            }}
          </h2>
          <p v-if="error">
            {{ error }}
          </p>
          <div v-else-if="!waiting">
            <section class="button-section" style="margin: 12px">
              <b-button
                v-for="(door, i) in doors"
                :key="i"
                :type="`is-primary ${door === selectedDoor ? 'is-light' : ''}`"
                :focused="door === selectedDoor"
                @click="selectedDoor = selectedDoor !== door ? door : null"
              >
                {{ door.name }}
              </b-button>
            </section>
          </div>
          <img
            v-else
            style="margin: auto; width: 64px"
            :src="require('@/assets/waiting.svg')"
          />
          <p v-else></p>
        </div>
      </section>
      <footer class="modal-card-foot is-full">
        <b-button
          v-if="!waiting"
          :type="!error && selectedDoor ? 'is-success' : 'is-primary'"
          :label="!error && selectedDoor ? 'Valider' : 'Annuler'"
          style="margin-left: auto"
          @click="onClick"
        />
      </footer>
    </div>
  </b-modal>
</template>

<script>
import formModal from "./formModal";

export default {
  name: "DoorAssignForm",
  data() {
    return {
      waiting: false,
      error: null,
      active: false,
      selectedDoor: null,
      locks: [],
      doors: [],
      interval: null,
    };
  },
  watch: {
    active: function (active) {
      if (!active) return;
      this.fetch();
    },
    locks: function (locks) {
      if (this.active || !locks.length) return;
      this.active = true;
    },
  },
  methods: {
    resetState() {
      this.waiting = false;
      this.error = null;
      this.active = false;
      this.selectedDoor = null;
    },
    onClick() {
      if (!this.selectedDoor || this.error) {
        return this.close();
      }

      this.waiting = true;
      this.$axios
        .$post("/lock", {
          ...this.locks[0],
          doorId: this.selectedDoor.id,
        })
        .then(() => {
          this.resetState();
          this.$buefy.toast.open({
            message: "Assignation réussie",
            type: "is-success",
          });
        })
        .catch((e) => {
          console.error(e);
          this.waiting = false;
          this.error = e;
        });
    },

    close() {
      this.resetState();
      this.$buefy.toast.open({
        message: "Assignation annulée",
        type: "is-info",
      });
    },
    fetch() {
      Promise.all([this.$axios.$get("/door")]).then(([doors]) => {
        this.doors = doors;
      });
    },
  },
  components: {
    formModal,
  },
  mounted() {
    this.fetch();
    this.interval = setInterval(() => {
      if (this.active) return;
      this.$axios
        .$get("/lock")
        .then(
          (locks) =>
            (this.locks = locks.filter(
              ({ doorId }) => !doorId || !doorId.length
            ))
        );
    }, 5000);
  },
  destroyed() {
    clearInterval(this.interval);
  },
};
</script>

<style >
</style>
