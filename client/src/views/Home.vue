<template>
  <div class="home">
    <Users :users="users" />
  </div>
</template>

<script>
// @ is an alias to /src
import Users from "@/components/Users.vue";
import axios from "axios";
import { getUrl } from "../js/utils";
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
    console.log("token", localStorage.getItem("token"));
    axios.get(getUrl("user")).then(({ data }) => (this.users = data));
    axios.get(getUrl("group")).then(({ data }) => console.log("/group", data));

    axios.get(getUrl("user/1")).then(({ data }) => console.log("user 1", data));
    axios
      .get(getUrl("testAuth"))
      .then(({ data }) => console.log("testAuth", data))
      .catch((e) => console.error("auth error", e.response.data));

    axios
      .post(getUrl("user"), {
        firstname: "",
        lastname: "user",
        groups: [],
      })
      .then(({ data }) => console.log("icic", data))
      .catch((e) => {
        console.error(e), console.log(e.response.data);
      });
  },
  components: {
    Users,
  },
};
</script>
