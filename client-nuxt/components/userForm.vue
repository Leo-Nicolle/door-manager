<template>
  <form-modal
    ref="form"
    :title="
      $route.params.id === 'new'
        ? 'Nouvel Utilisateur'
        : `${user.firstname} ${user.lastname}`
    "
    :item="userWithGroupNames"
    :filteredData="filteredGroups"
    :schema="schema"
    @submit="submit"
    @remove="remove"
    @close="$emit('close')"
  />
</template>

<script>
import formModal from "./formModal";

export default {
  name: "UserForm",
  props: ["user"],
  data() {
    return {
      schema: {
        fields: [
          {
            label: "Prenom",
            model: "firstname",
            type: "name",
          },
          {
            label: "Nom",
            model: "lastname",
            type: "name",
          },
          {
            label: "Groupes",
            model: "groups",
            type: "tag",
            model: "groups",
            getFilteredData: (text) => {
              this.getFilteredGroups(text);
            },
          },
          {
            label: "Admin",
            model: "isAdmin",
            type: "checkbox",
          },
          {
            label: "email",
            model: "email",
            type: "email",
            condition: () => this.userWithGroupNames.isAdmin,
          },
          {
            label: "mot de passe",
            model: "password",
            type: "password",
            condition: () => this.userWithGroupNames.isAdmin,
          },
          {
            label: "mot de passe(confirmer)",
            model: "confirm",
            type: "password",
            condition: () => this.userWithGroupNames.isAdmin,
          },
        ],
        required: ["name"],
      },
      // all the groups in the DB
      groups: [],
      // the groups filtered by typing
      filteredGroups: [],
      // the user with groupNames instead of ids
      userWithGroupNames: {},
    };
  },
  methods: {
    getFilteredGroups(text) {
      console.log('getFG', text)
      this.filteredGroups = !text.length
        ? this.groups.map(({name}) => name)
        : this.groups
            .filter(({ name }) => {
              return name.toLowerCase().indexOf(text.toLowerCase()) >= 0;
            })
            .map(({ name }) => name);
    },
    submit() {
      const user = {
        ...this.userWithGroupNames,
        groups: this.userWithGroupNames.groups.map(
          (name) => this.groups.find((g) => g.name === name).id
        ),
      };
      console.log("USER", user.password, user.confirm);
      this.encrypt([user.password, user.confirm])
        .then(([password, confirm]) => {
          return this.$axios.$post("/user", {
            ...user,
            password: password || "",
            confirm: confirm || "",
          });
        })
        .then(() => {
          this.$emit("close");
        })
        .catch((e) => this.$refs.form.validation(e));
    },
    remove() {
      this.$axios
        .$delete(`user/${this.user.id}`)
        .then(() => this.$emit("close"))
        .catch((e) => {
          console.error(e);
        });
    },
  },
  components: {
    formModal,
  },
  mounted() {
    return this.$axios.$get("/group").then((groups) => {
      this.groups = groups;
      this.userWithGroupNames = {
        ...this.user,
        groups: this.user.groups
          .map((id) => {
            const group = this.groups.find((group) => group.id === id);
            return group && group.name;
          })
          .filter((e) => e),
      };
      this.getFilteredGroups('');
    });
  },
  //   onConfirmAddBadge() {
  //     axios
  //       .post(getUrl("badge/assign"))
  //       .then(({
  //         data
  //       }) => {
  //         if (!data) return;
  //         this.addingBadgeMessage = '';
  //       })
  //       .catch((e) => console.error(e)).finally(() =>
  //         this.onCancelAddBadge()
  //       )
  //   },
  //   onCancelAddBadge() {
  //     clearInterval(this.requestNewBadgeTimeout);
  //     this.isAddingBadge = false;
  //     return axios
  //       .post(getUrl("badge/stop-add"), )
  //   },
  //   onStartAddBadge() {
  //     this.addingBadgeMessage = "En attente de scan du badge";
  //     this.isAddingBadge = true;
  //     axios
  //       .post(getUrl("badge/start-add"), {
  //         userId: this.user.id
  //       })
  //       .then(() => {
  //         this.requestNewBadgeTimeout = setInterval(() => {
  //           axios
  //             .get(getUrl("badge/last-unknown"))
  //             .then(({
  //               data
  //             }) => {
  //               if (!data) return;
  //               this.addingBadgeMessage = `Badge ${data} scanné. Assigner ?`;
  //             })
  //             .catch((e) => console.error(e));
  //         }, 500);
  //       })
  //       .catch((e) => console.error(e));
  //   },
  //   onDeleteBadge(event, uuid) {
  //     event.stopPropagation();
  //     event.preventDefault();
  //     this.user.badges = this.user.badges.filter((badge) => badge !== uuid);
  //   },
  // },
  // components: {
  //   Treeselect,
  //   Confirm,
  //   AdminModal,
  //   Form,
  // },
};
</script>
