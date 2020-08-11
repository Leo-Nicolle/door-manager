<template>
  <transition name="fade">
    <div class="modal">
      <div class="modal-body">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
};
</script>
<style>
.modal {
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  background: rgba(127, 127, 127, 0.5);
  transform: translateX(-50%);
}
.modal-body {
  min-width: calc(100% - 30px);
  max-width: calc(100% - 30px);
  opacity: 1;
  background: #fff;
  min-height: 50%;
  height: min-content;
  max-height: 100%;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
