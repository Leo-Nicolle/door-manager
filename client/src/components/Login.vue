<template>
  <div>
    <form>
      <div class="body">
        <label>
          email
          <input
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
            type="password"
            v-model="userData.password"
            id="password"
            name="password"
            required
          />
        </label>
        <p class="invalid">{{ errorMessage }}</p>
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
  name: "Login",
  data() {
    return {
      errorMessage: "",
      userData: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    onSubmit() {
      this.errorMessage = "";
      axios
        .post(getUrl("login"), {
          email: this.userData.email,
          // TODO: use hash
          password: this.userData.password,
        })
        .then(({ data }) => {
          localStorage.setItem("token", data.token);
          this.$router.push("/user");
        })
        .catch((e) => {
          this.errorMessage = "Mauvais login ou mot de passe";
          console.error("auth error", e.response.data);
        });
    },
  },
  mounted() {},
  components: {},
};
</script>
<style></style>
