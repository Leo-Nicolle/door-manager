<template>
  <form-modal
    ref="form"
    :title="
      $route.params.id === 'new'
        ? 'Nouvelle Porte'
        : `${door.name}`
    "
    :item="door"
    :schema="schema"
    @submit="submit"
    @remove="remove"
    @close="$emit('close')"
  >
  </form-modal>
</template>

<script>
import formModal from "./formModal";

export default {
  name: "DoorForm",
  props: ["door"],
  computed: {
    schema: function () {
      return {
        fields: [
          {
            label: "Nom",
            model: "name",
            type: "name",
          },
        ],
        required: ["name"],
      };
    },
  },
  data() {
    return {
    };
  },
  methods: {
    submit() {
      const door = {
        ...this.door,
      };
      this.$axios
        .$post("/door", {
          ...door,
        })
        .then(() => {
          this.$emit("close");
        })
        .catch((e) => this.$refs.form.validation(e));
    },
    remove() {
      this.$axios
        .$delete(`door/${this.door.id}`)
        .then(() => this.$emit("close"))
        .catch((e) => {
          console.error(e);
        });
    },
  },
  components: {
    formModal,
  },
  mounted() {
  },
};
</script>

<style >
</style>
