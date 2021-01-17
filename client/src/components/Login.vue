<template>
  <div>
    <form>
      <div class="body">
        <label>
          email
          <input type="text" v-model="userData.email" id="email" name="email" required />
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
        <router-link to="/password-reset">Mot de passe oublie</router-link>|
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
import { getUrl, loggedIn, logOut } from "../js/utils";
import axios from "axios";
import encrypt from "quick-encrypt";

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
        .get(getUrl("encrypt"))
        .then(({ data }) => {
          const publicKey = data;
          return encrypt.encrypt(this.userData.password, publicKey);
        })
        .then((encryptedPassword) =>
          axios.post(getUrl("login"), {
            email: this.userData.email,
            password: encryptedPassword,
          })
        )
        .then(({ data }) => {
          localStorage.setItem("token", data.token);
          this.$emit("login");
          this.$router.push("/user");
        })
        .catch((e) => {
          this.errorMessage = "Mauvais login ou mot de passe";
          console.error("auth error", e.response.data);
        });
    },
  },
  mounted() {
    loggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        logOut();
        this.$emit("logout");
      }
    });
  },
  components: {},
};
</script>
<style></style>
