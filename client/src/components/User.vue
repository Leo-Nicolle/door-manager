<template>
  <form v-if="user">
    <label>
      nom de famille
      <input
        :class="getClass('lastname')"
        type="text"
        v-model="user.lastname"
        id="lastname"
        name="lastname"
        required
      />
    </label>
    <label>
      Prenom
      <input
        :class="getClass('firstname')"
        type="text"
        v-model="user.firstname"
        id="firstname"
        name="firstname"
        required
      />
    </label>
    <div>
      <input type="submit" value="valider" @click="onSubmit" />
      <input type="submit" value="anuler" @click="onCancel" />
    </div>
  </form>
</template>

<script>
import { getUrl } from "../js/utils";
import axios from "axios";

export default {
  name: "User",
  props: {
    user: null,
  },
  data() {
    return {
      invalidFields: [],
    };
  },
  methods: {
    getClass(fieldName) {
      return this.invalidFields.find((f) => f === fieldName) ? "invalid" : "";
    },
    onSubmit(event) {
      console.log("sending");
      axios
        .post(getUrl("user"), this.user)
        .then(({ data }) => console.log("validated", data))
        .catch((e) => {
          if (!e.response.data) return console.error(e);
          console.log("response error", e.response.data.errors);
          this.invalidFields = e.response.data.errors.map(({ param }) => param);
          event.preventDefault();
        });
    },
    onCancel() {
      this.$router.push({ name: "Users" });
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
  flex-direction: column;
  align-items: start;
  width: 100%;
  justify-content: space-around;
  margin: 0px 20px;
}
</style>
