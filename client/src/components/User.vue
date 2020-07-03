<template>
  <form v-if="user">
    <label>
      nom de famille
      <input
        type="text"
        v-model="user.lastname"
        id="lastname"
        name="lastname"
        required
      />
    </label>
    <label>
      Prenom
      <input
        type="text"
        v-model="user.lastname"
        id="firstname"
        name="firstname"
        required
      />
    </label>
    <input type="submit" value="valider" @click="onSubmit()" />
    <input type="submit" value="anuler" @click="onCancel()" />
  </form>
</template>

<script>
export default {
  name: "User",
  props: {
    user: null,
  },
  methods: {
    onSubmit() {
      console.log("submit");
    },
    onCancel() {
      console.log("cancel");
    },
  },
};
</script>
<style></style>
