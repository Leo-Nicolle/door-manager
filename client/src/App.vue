<template>
  <div id="app">
    <div id="nav">
      <router-link to="/user">Utilisateurs</router-link>|
      <router-link to="/group">Groupes</router-link>|
      <router-link to="/schedule">Horraires</router-link>|
      <router-link to="/door">Portes</router-link>|
      <router-link to="/badge">Badges</router-link>|
      <router-link to="/log">Logs</router-link>|
      <router-link to="/login">{{logginText}}</router-link>
    </div>
    <PopupNewLock />
    <router-view @login="onLogIn" @logout="onLogOut" />
  </div>
</template>

<script>
import { loggedIn } from "./js/utils";
import PopupNewLock from './components/PopupNewLock';
export default {
  name: "App",
  data() {
    return {
      loggedIn: false,
    };
  },
  computed: {
    logginText: function () {
      return this.loggedIn ? "Log out" : "Log in";
    },
  },

  methods: {
    onLogIn() {
      this.loggedIn = true;
    },
    onLogOut() {
      this.loggedIn = false;
    },
  },
  mounted() {
    loggedIn().then((isLoggedIn) => (this.loggedIn = isLoggedIn));
  },
  components: {
    PopupNewLock
  }
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
