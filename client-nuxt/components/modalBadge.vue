<template>
  <b-modal :width="640" :active="active" scroll="keep">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Assigner un badge</p>
        <button type="button" class="delete" @click="onClose" />
      </header>
      <section class="modal-card-body" style="padding: 12px 0">
        <div class="content" style="text-align: center">
          <h2>
            {{
              error
                ? getErrorText()
                : badgeId
                ? "Badge Scanné:"
                : "En attente de scan de badge...."
            }}
          </h2>
          <p v-if="error">
            {{ error }}
          </p>
          <img
            v-else-if="!badgeId"
            style="margin: auto; width: 64px"
            :src="require('@/assets/waiting.svg')"
          />
          <p v-else>
            {{ badgeId }}
          </p>
        </div>
      </section>
      <footer class="modal-card-foot is-full">
        <b-button
          :type="badgeId ? 'is-success' : 'is-primary'"
          :label="badgeId ? 'Valider' : 'Annuler'"
          style="margin-left: auto"
          @click="badgeId ? onValidate() : onClose()"
        />
      </footer>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "ModalBadge",
  props: ["user", "active"],
  components: {},
  data() {
    return {
      badgeId: null,
      error: null,
      requestNewBadgeInterval: null,
    };
  },
  watch: {
    active: function (active) {
      if (!active) {
        console.log('de activate')
        clearInterval(this.requestNewBadgeInterval);
        this.error = null;
        this.badgeId = null;
        return this.$axios.$post("/badge/stop-adding", {
          userId: this.user.id,
        });
      }
      return this.$axios
        .$post("/badge/start-adding", {
          userId: this.user.id,
        })
        .then(() => {
          this.requestNewBadgeInterval = setInterval(() => {
            this.$axios
              .$get("/badge/last-unknown")
              .then((id) => {
                if (!id) return;
                this.badgeId = id;
                clearInterval(this.requestNewBadgeInterval);
              })
              .catch((e) => {
                if (e.statusCode === 406) {
                  // still waiting for scan
                  return;
                }
                this.error = e;
                console.error(e);
              });
          }, 500);
        })
        .catch((e) => {
          this.error = e;
          console.error(e);
        });
    },
  },
  methods: {
    getErrorText() {
      return this.error
        ? this.error.statusCode === 408
          ? "Le serveur n'est pas en mode `attente de badge`"
          : this.error.statusCode === 500
          ? "Le serveur ne connait pas l'utilisateur"
          : this.error
        : "Pas d'erreur";
    },
    onValidate() {
      this.$axios
        .$post("/badge/stop-adding")
        .then(() => {
          this.$emit("validate", this.badgeId);
        })
        .catch((e) => {
          console.error(e);
          this.$emit("close");
        });
    },
    onClose() {
      this.$emit("close");
    },
  },
};
</script>

<style>
.modal-close {
  display: none;
}
</style>
