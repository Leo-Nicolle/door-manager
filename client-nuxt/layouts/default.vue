<template>
  <div>
    <nav
      class="navbar header has-shadow is-primary"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <img src="~assets/passkey.png" alt="doormanager" height="28" />
        </a>
        <nuxt-link
          v-for="(item, key) of items"
          :key="key"
          :to="item.to"
          class="navbar-item"
          exact-active-class="is-active"
        >
          {{ item.title }}
        </nuxt-link>
      </div>
    </nav>

    <nuxt />
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          title: "Home",
          to: { name: "index" },
        },
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
      ],
    };
  },
  
};
</script>
