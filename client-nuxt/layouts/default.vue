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
          icon: "home",
          to: { name: "index" },
        },
        {
          title: "Utilisateurs",
          icon: "utilisateurs",
          to:  "user",
        },
         {
          title: "Groupes",
          icon: "groupes",
          to:  "group",
        },
      ],
    };
  },
  async asyncData({ $axios }) {
    $axios
      .$get("/users", {
        // cancelToken: source.token
      })
      .then((users) => console.log("users", users))
      .catch((error) => {
        if (this.$axios.isCancel(error)) {
          console.log("Request canceled", error);
        } else {
          // handle error
        }
      });

    // const users = await `${serverUrl}/users`
    //   .then((res) => {
    //     console.log("res", res, res.json());
    //   })
    //   .catch((e) => console.error("error", error));
    // console.log('ICI', this.$config)
  },

  // this.posts = await fetch(`${this.$config.serverUrl}/posts`).then(res =>
  //   console.log('ICII',res)
  // )
  // },
};
</script>
