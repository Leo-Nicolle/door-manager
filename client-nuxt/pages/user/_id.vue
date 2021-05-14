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
          searchable: true,
          label: "prenom",
          width: "40",
        },
        {
          field: "lastname",
          searchable: true,
          label: "nom",
          width: "40",
        },
        {
          field: "badges",
          searchable: true,
          label: "badges",
          width: "40",
        },
        {
          field: "isAdmin",
          searchable: true,
          label: "admin",
          width: "40",
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
