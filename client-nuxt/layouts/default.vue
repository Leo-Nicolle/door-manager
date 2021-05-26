<template>
  <div>
    <nav
      class="navbar header has-shadow is-primary"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand" style="width:100%;">
        <nuxt-link class="navbar-item" to="/">
          <img
            src="~assets/passkey.png"
            style="margin-right: 6px"
            alt="home"
            height="28"
          />
        </nuxt-link>
        <nuxt-link
          v-for="(item, key) of items"
          :key="key"
          :to="item.to"
          class="navbar-item"
          exact-active-class="is-active"
        >
          {{ item.title }}
        </nuxt-link>
        <nuxt-link class="navbar-item" style="margin-left: auto" to="/login">
          <img
            :src="require(`~/assets/${loggedIn ? 'logout' : 'login'}.png`)"
            style="margin-right: 6px"
            alt="login"
            height="28"
          />
          {{ loggedIn ? "Déconnection" : "Connection" }}
        </nuxt-link>
      </div>
    </nav>
    <nuxt />
    <door-assign v-if="loggedIn" :active="true" />
  </div>
</template>

<script>
import doorAssign from '../components/doorAssign.vue';
import loginout from "../mixins/loginout";

export default {
  components: { doorAssign },
  data() {
    return {
      loggedIn: false,
      items: [
        {
          title: "Utilisateurs",
          to: "/user",
        },
        {
          title: "Groupes",
          to: "/group",
        },
        {
          title: "Horraires",
          to: "/schedule",
        },
        {
          title: "Portes",
          to: "/door",
        },
        {
          title: "Configuration",
          to: "/settings",
        },
        {
          title: "Logs",
          to: "/log",
        },
      ],
    };
  },
  mixins: [loginout],
  methods: {
    update() {
      return this.isLoggedIn().then((loggedId) => (this.loggedIn = loggedId));
    },
  },
  mounted() {
    this.update().then(() => console.log("loggedin", this.loggedIn));
  },
};
</script>

<style>
.nuxt-progress{
  display: none;
}
</style>
