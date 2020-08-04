<template>
  <div>
    <form>
      <div class="body">
        <label>
          email
          <input
            :class="getClass('email')"
            type="text"
            v-model="userData.email"
            id="email"
            name="email"
            required
          />
        </label>
        <label>
          Prenom
          <input
            :class="getClass('password')"
            type="password"
            v-model="userData.password"
            id="password"
            name="password"
            required
          />
        </label>
      </div>
      <div class="footer">
        <!-- <input class="validate" type="submit" value="login" @click="onSubmit" /> -->
      </div>
    </form>
    <button class="validate" @click="onSubmit">login</button>
  </div>
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

      userData: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    getClass(fieldName) {
      return this.invalidFields.find((f) => f === fieldName) ? "invalid" : "";
    },

    onSubmit(event) {
      axios
        .post(getUrl("login"), this.userData)
        .then(() => {
          this.$router.push("/user");
        })
        .catch((e) => {
          if (!e.response.data) return console.error(e);
          console.log("response error", e.response.data[2].message);
          event.preventDefault();
          event.stopPropagation();
        });
    },
  },
  mounted() {},
  components: {},
};
</script>
<style>
</style>
