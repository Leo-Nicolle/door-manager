<template>
  <section class="section">
    <section v-if="!user">
       <b-button
          label="Nouveau"
          @click="$router.push('/users/new')"
          type="is-success"
          class="is-pulled-right"
        />
        <users />
    </section>
    <user-form v-else :user="user" @close="$router.push('/users')"/>
  </section>
</template>

<script>

import UserForm from '../../components/userForm.vue'
import Users from '../../components/users.vue'


export default {
  name: "userPage",
  data() {
    return {
      user: null,
    };
  },
  components: {
    UserForm,
    Users,
  },
  mounted() {
    const id = this.$route.params.id;
    if(!id) return;

    this.$axios
      .$get(`/user/${this.$route.params.id}`)
      .then((user) => {
        console.log("USER", user)
        this.user = user;
      })
      .catch((error) => {
        console.log("error", error);
      });
  },
};
</script>
