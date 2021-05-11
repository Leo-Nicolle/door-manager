<template>
  <section class="section">
    <b-table
      :bordered="true"
      :striped="true"
      :hoverable="true"
      :paginated="true"
      :data="users"
      :columns="columns"
      @select="onSelect"
    ></b-table>
  </section>
</template>

<script>

export default {
  name: "users",
  data() {
    return {
      isModalActive: false,
      selectedUser: null,
      users: [],
      columns: [
        {
          field: "firstname",
          label: "prenom",
          width: "40",
          // numeric: true,
        },
        {
          field: "lastname",
          label: "nom",
          width: "40",
          // numeric: true,
        },
        {
          field: "isAdmin",
          label: "admin",
          width: "40",
          boolean: true,
        },
        // {
        //   field: "first_name",
        //   label: "First Name",
        // },
        // {
        //   field: "last_name",
        //   label: "Last Name",
        // },
        // {
        //   field: "date",
        //   label: "Date",
        //   centered: true,
        // },
      ],
    };
  },
  components: {
  },
  methods: {
    onSelect(user) {
      this.selectedUser = user;
      this.isModalActive = true;
      this.$router.push(`/users/${user.id}`)
    },
  },
  mounted() {
    this.$axios
      .$get("/user")
      .then((users) => {
        this.users = users;
        this.columns;
      })
      .catch((error) => {
        console.log("error", error);
      });
  },
};
</script>
