<template>
    <item-view :route="route" :columns="columns">
      <template slot-scope="{item}">
        <user-form :user="item" @close="$router.push(route)"/>
      </template>
    </item-view>
  </section>
</template>

<script>
import ItemView from '../../components/itemView.vue';
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
          width: "40",
        },
        {
          field: "lastname",
          label: "nom",
          width: "40",
        },
        {
          field: "isAdmin",
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
