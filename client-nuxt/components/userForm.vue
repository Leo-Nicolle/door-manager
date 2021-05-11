<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">
          {{
            $route.params.id === "new"
              ? "nouvel utilisateur"
              : `${user.firstname} ${user.lastname}`
          }}
        </p>
        <button type="button" class="delete" @click="$emit('close')" />
      </header>
      <section class="modal-card-body">
        <b-field label="Nom">
          <b-input
            type="nom"
            v-model="user.lastname"
            placeholder="nom"
            :message="getMessage('lastname')"
            required
          >
          </b-input>
        </b-field>
        <b-field label="Prenom">
          <b-input
            type="prenom"
            v-model="user.firstname"
            placeholder="prenom"
            required
          >
          </b-input>
        </b-field>

        <b-field>
          <b-checkbox v-model="user.isAdmin">Admin </b-checkbox>
        </b-field>
        <section v-if="user.isAdmin">
          <b-field :type="getInputType('email')" label="Email">
            <b-input
              type="email"
              v-model="user.email"
              placeholder="email"
              required
            >
            </b-input>
          </b-field>

          <b-field
            label="Mot de Passe"
            :message="getMessage('password')"
            :type="getInputType('password')"
          >
            <b-input
              type="password"
              v-model="user.password"
              password-reveal
              placeholder="Mot de Passe"
              required
            >
            </b-input>
          </b-field>
          <b-field
            :type="getInputType('confirm')"
            label="Mot de passe (confirmer)"
          >
            <b-input
              type="password"
              v-model="user.confirm"
              password-reveal
              placeholder="Mot de Passe"
              :message="getMessage('confirm')"
              required
            >
            </b-input>
          </b-field>
        </section>

        <b-field label="Groupes">
          <b-taginput
            v-model="userGroups"
            :data="filteredGroups"
            :open-on-focus="true"
            autocomplete
            field="user.groups"
            icon="label"
            placeholder="Ajouter un groupe"
            @typing="getFilteredGroups"
          >
            <template #empty> Aucun groupe </template>
          </b-taginput>
        </b-field>
      </section>

      <footer class="modal-card-foot is-full" style="justify-content: space-between;">
        <b-button
          label="Annuler"
          type="is-danger"
          @click="$emit('close')"
        />
         <b-button
          label="Suppirmer"
          @click="remove"
          type="is-dark"
        />
        <b-button
          label="Valider"
          @click="submit"
          type="is-primary"
        />
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  name: "UserForm",
  props: ["user"],
  data() {
    return {
      groups: [],
      userGroups: [],
      filteredGroups: [],
    };
  },
  watch: {
    user: function () {
      this.updateUserGroups();
    },
  },
  methods: {
    getFilteredGroups(text) {
      console.log("text", text, this.filteredGroups);
      this.filteredGroups = this.groups
        .filter(({ name }) => {
          return name.toLowerCase().indexOf(text.toLowerCase()) >= 0;
        })
        .map(({ name }) => name);
    },
    updateUserGroups() {
      this.userGroups = this.user.groups
        .map((id) => {
          const group = this.groups.find((group) => group.id === id);
          return group && group.name;
        })
        .filter((e) => e);
    },
    submit() {
      // axios
      // .get(getUrl("encrypt"))
      // .then(({
      //   data
      // }) => {
      //   const publicKey = data;
      //   return this.user.isAdmin && this.user.password.length ?
      //     encrypt.encrypt(this.user.password, publicKey) :
      //     "";
      // })
      this.invalidFields = [];
      this.encrypt([this.user.password, this.user.confirm])
        .then(([password, confirm]) =>
          this.$axios.$post("/user", {
            ...this.user,
            password,
            confirm,
          })
        )
        .then(() => {
          this.$emit("close");
        })
        .catch((e) => this.validation(e));
    },
    remove(){
       this.$axios
        .$delete(`user/${this.user.id}`)
        .then(() => this.$emit("close"))
        .catch((e) => {
          console.error(e);
        });
    },
  }, 
  mounted() {
    return this.$axios.$get("/group").then((groups) => {
      console.log("groups", groups);
      this.groups = groups;
      this.updateUserGroups();
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
