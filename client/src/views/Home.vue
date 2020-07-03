<template>
  <div class="home">
    <Users :users="users" />
  </div>
</template>

<script>
// @ is an alias to /src
import Users from "@/components/Users.vue";
import axios from "axios";
export default {
  name: "Home",
  data() {
    return {
      users: [
        { lastname: "coucou", firstname: "coucouc" },
        { lastname: "coucou", firstname: "coucouc" },
        { lastname: "coucou", firstname: "coucouc" },
      ],
    };
  },
  mounted() {
    axios
      .get("http://localhost:3000/user")
      .then(({ data }) => (this.users = data));

    axios
      .get("http://localhost:3000/user/1")
      .then(({ data }) => console.log("icic", data));
  },
  components: {
    Users,
  },
};
</script>
