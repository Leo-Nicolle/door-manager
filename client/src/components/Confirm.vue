<template>
 <Modal v-if="visible">
    <h3>{{message}}</h3>
    <div class="footer">
      <button class="delete" @click="onCancel">annuler</button>
      <button class="validate" @click="onConfirm">Ok</button>
    </div>
  </Modal>
</template>

<script>
import Modal from './Modal';
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
  components: {Modal}
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
