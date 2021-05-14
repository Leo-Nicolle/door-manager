<template>
  <div>
    <div class="content">
      <section v-if="error.statusCode === 404">
        <h1 class="title is-1">Page inexistante</h1>
        <NuxtLink to="/">
          <b-image
            style="width: 75%; margin: auto"
            :src="require('~/assets/404.png')"
            alt="404"
          ></b-image>
        </NuxtLink>
      </section>
      <section v-else>
        <h1 class="title is-1">Une erreur est survenue:</h1>
        <p>
          {{ error }}
        </p>
        <NuxtLink to="/">Retour à la maison</NuxtLink>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  props: ["error"],
  layout: "error", // you can set a custom layout for the error page
};
</script>

<style scoped>
.title {
  text-align: center;
  margin: 12px;
}
</style>