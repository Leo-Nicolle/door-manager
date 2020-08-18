<template>
  <form v-if="element">
    <div class="body">
      <slot name="body"></slot>
    </div>
    <div class="footer">
      <input class="validate" type="submit" value="valider" @click="onSubmit" />
      <button @click="onCancel">cancel</button>
      <input class="delete" type="submit" value="suprimer" @click="onDelete" />
    </div>
  </form>
</template>

<script>
export default {
  name: "Form",
  props: ["element", "onSubmit", "onDelete", "onCancel"],
  data() {
    return {
      invalidFields: [],
    };
  },
  methods: {
    getClass(fieldName) {
      return this.invalidFields.find((f) => f === fieldName) ? "invalid" : "";
    },
  },
};
</script>
<style>
.invalid {
  background: #f00;
}
form {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  margin: 20px;
  width: 100%;
}
.body {
  min-width: 310px;
  max-width: 500px;
  align: center;
}

label {
  margin: 12px 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
label > input[type="checkbox"] {
  margin-top: 4px;
}
.footer {
  min-width: calc(100% - 20px);
  max-width: calc(100% - 20px);
  display: flex;
  justify-content: space-between;
}
.long-input {
}
.small-button {
  max-height: 1em;
  line-height: 0;
  padding: 1em 0.5em;
  max-width: fit-content;
}
</style>
