<template>
  <div class="modal" v-if="visible">
    <div class="modal-body modal-body-small">
      <p class="body">{{message}}</p>
      <div class="footer">
        <button class="delete" @click="onCancel">annuler</button>
        <button class="validate" @click="onConfirm">Ok</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Confirm",
  props: ["visible", "message"],
  methods: {
    onCancel(event) {
      event.stopPropagation();
      event.preventDefault();
      this.$emit("cancel");
    },
    onConfirm(event) {
      event.stopPropagation();
      event.preventDefault();
      this.$emit("confirm");
    },
  },
};
</script>
<style>
.modal-body.modal-body-small {
  max-height: min-content;
  min-height: min-content;
}
.modal-body-small > div {
  margin: 12px 0;
}
</style>
