
export default {
  methods: {
    isLoggedIn: function () {
      return this.$axios
        .$get("/api/loggedin")
        .then(() => true)
        .catch(() => false);
    },
    logout: function () {
      const token = localStorage.getItem("token");
      localStorage.setItem("token", null);
      return this.$axios.get(`/api/logout/${token}`);
    }
  }
}