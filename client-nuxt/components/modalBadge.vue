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
            {{ badgeId ? "Badge Scanné:" : "En attente de scan de badge...." }}
          </h2>
          <img
            v-if="!badgeId"
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
      requestNewBadgeTimeout: null,
    };
  },
  methods: {
    onValidate() {
      clearTimeout(this.requestNewBadgeTimeout);
      this.$emit("validate", this.badgeId);
    },
    onClose() {
      clearTimeout(this.requestNewBadgeTimeout);
      this.$emit("close");
    },
  },
  mounted() {
    this.$axios
      .$post("badge/start-add", {
        userId: this.user.id,
      })
      .then(() => {
        this.requestNewBadgeTimeout = setInterval(() => {
          this.$axios
            .$get("badge/last-unknown")
            .then((id) => {
              if (!id) return;
              this.badgeId = id;
            })
            .catch((e) => console.error(e));
        }, 500);
      })
      .catch((e) => console.error(e));
  },
};
</script>

<style>
.modal-close{
  display: none;
}
</style>
