<template>
  <form v-if="element">
    <slot class = "body"  name="body"></slot>
    <div class="footer">
      <input class="validate" type="submit" value="valider" @click="onSubmit" />
      <button @click="onCancel">cancel</button>
      <input v-if="onDelete" class="delete" type="submit" value="suprimer" @click="onDeleteClick" />
    </div>
    <Confirm
      :message="getDeleteMessage()"
      :visible="confirmVisible"
      @confirm="onValidateConfirm"
      @cancel="onValidateCancel"
    />
  </form>
</template>

<script>
import Confirm from "../components/Confirm";
export default {
  name: "Form",
  props: ["element", "onSubmit", "onDelete", "onCancel"],
  data() {
    return {
      invalidFields: [],
      confirmVisible: false,
    };
  },
  methods: {
    getDeleteMessage() {
      return "Etes vous sur ? ";
    },
    onDeleteClick() {
      event.stopPropagation();
      event.preventDefault();
      this.confirmVisible = true;
    },
    onValidateConfirm() {
      this.confirmVisible = false;
      this.onDelete();
    },
    onValidateCancel() {
      this.confirmVisible = false;
    },
    getClass(fieldName) {
      return this.invalidFields.find((f) => f === fieldName) ? "invalid" : "";
    },
  },
  components: {
    Confirm,
  },
};
</script>
<style>
.invalid {
  border-color: #c03;
  outline-color: #c03;
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
  align: center;
  margin: 0 6px;
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
.long-input {
}
.small-button {
  max-height: 1em;
  line-height: 0;
  padding: 1em 0.5em;
  max-width: fit-content;
}
</style>
