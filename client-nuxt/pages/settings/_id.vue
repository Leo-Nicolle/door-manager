<template>
  <section>
    <p v-if="error">{{ error }}</p>
    <setting-form
      v-else
      :settings="settings"
      @close="onClose"
      @submit="showToaster"
    />
  </section>
</template>

<script>
import SettingForm from "../../components/settingForm.vue";

export default {
  name: "settingsPage",
  data() {
    return {
      settings: null,
      error: null,
    };
  },

  components: {
    SettingForm,
  },
  methods: {
    showToaster() {
      this.$buefy.toast.open({
        message: "Configuration sauvergardée!",
        type: "is-success",
      });
    },
    onClose() {
      this.$router.push("/");
      this.$buefy.toast.open({
        message: "Modifications non sauvegardées!",
      });
    },
  },
  mounted() {
    this.$axios
      .$get("/settings")
      .then((settings) => {
        this.settings = settings;
      })
      .catch((e) => (this.error = e));
  },
};
</script>
