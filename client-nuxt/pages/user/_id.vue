<template>
  <item-view :route="route" :columns="columns">
    <template slot-scope="{ item }">
      <user-form :user="item" @close="$router.push(route)" />
    </template>
  </item-view>
</template>

<script>
import ItemView from "../../components/itemView.vue";
import UserForm from "../../components/userForm.vue";

export default {
  name: "userPage",
  data() {
    return {
      route: "/user",
      columns: [
        {
          field: "firstname",
          label: "prenom",
        },
        {
          field: "lastname",
          label: "nom",
        },
        {
          field: "badges",
          label: "badges",
          format: (badges) =>
            `<p  class="${
              badges.length ? "has-text-success" : "has-text-danger"
            }">${badges.length ? badges.joint(" ") : "pas de badges"}</p>`,
        },
        {
          field: "isAdmin",
          label: "admin",
          format: (isAdmin) =>
            `<p  class="${isAdmin ? "has-text-success" : ""}">${
              isAdmin ? "oui" : "non"
            }</p>`,
          customSearch: (user, query) => {
            return this.yesNo(query) ? user.isAdmin : !user.isAdmin;
          },
          boolean: true,
        },
      ],
    };
  },
  components: {
    UserForm,
    ItemView,
  },
};
</script>
