<template>
<div class="section columns is-mobile is-centered is-vcentered">
  <form  class="column is-half box">
    <b-field label="Email">
      <b-input
        v-model="userData.email"
        type="email"
        value="nom@"
        maxlength="30"
      >
      </b-input>
    </b-field>

    <b-field
      label="Password"
      :type="errorMessage ? 'is-danger' : ''"
      :message="errorMessage"
    >
      <b-input
        v-model="userData.password"
        value="123"
        type="password"
        maxlength="30"
      ></b-input>
    </b-field>
    <b-button type="is-primary" @click="onSubmit" outlined>Login</b-button>
  </form>
  </div>
</template>



<script>
// import { getUrl, loggedIn, logOut } from "../js/utils";
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
      console.log("pass", this.userData.password, this.userData.email);
      this.$axios
        .$get("/encrypt")
        .then((publicKey) => encrypt.encrypt(this.userData.password, publicKey))
        .then((encryptedPassword) =>
          this.$axios.$post("login", {
            email: this.userData.email,
            password: encryptedPassword,
          })
        )
        .then(({ token }) => {
          localStorage.setItem("token", token);
          // this.$emit("login");
          this.$router.back();
          // this.$router.push("/user");
        })
        .catch((e) => {
          this.errorMessage = "Mauvais login ou mot de passe";
          console.error("auth error", e.response.data);
        });
    },
  },
  mounted() {
    // loggedIn().then((isLoggedIn) => {
    //   if (isLoggedIn) {
    //     // logOut();
    //     this.$emit("logout");
    //   }
    // });
  },
  components: {},
};
</script>
<style></style>
