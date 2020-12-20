<template>
<Modal v-if ='element'>
  <form>
   <div class="body">
      <label>
        email:
        <input :class="getClass('email')" type="text" v-model="user.email" id="email" name="email" required />
      </label>
      <label>
        Mot de Passe:
        <input :class="getClass('password')" type="password" v-model="user.password" id="password" name="password" required />
      </label>
       <label>
        Confirmer:
        <input :class="getClass('password')" type="password" v-model="passwordCheck" id="passwordCheck" name="passwordCheck" required />
      </label>
    </div>
    <div class="footer">
      <input class="validate" type="submit" value="valider" @click="onSubmit" />
      <button @click="onCancel">cancel</button>
    </div>
  </form>
</Modal>

</template>

<script>
import {
  getUrl
} from "../js/utils";
import axios from "axios";
import encrypt from "quick-encrypt";
import Modal from "./Modal";

import FormMixin from "../mixins/FormMixin";

export default {
  name: "AdminModal",
  data() {
    return {
      passwordCheck: '',
      hashedPassword: ''
    };
  },
  mixins: [FormMixin],
  computed: {
    user: {
      get: function () {
        return this.element;
      },
      set: function (user) {
        this.element = user;
      },
    },
  },
  methods: {
    check(){
      const check = this.passwordCheck === this.user.password 
        && this.passwordCheck.length;
      this.invalidFields = this.invalidFields
        .filter(field => field !== 'password' && field !== 'passwordCheck');
      if(!check){
        this.invalidFields = this.invalidFields.concat(['password','passwordCheck']);
      }
      return check;
    },
    onSubmit(event) {
      event.preventDefault();
      event.stopPropagation();

      if(!this.check()) return;
      axios
        .get(getUrl("encrypt"))
        .then(({
          data
        }) => {
          const publicKey = data;
          return this.user.isAdmin && this.user.password.length ?
            encrypt.encrypt(this.user.password, publicKey) :
            "";
        })
        .then((password) =>{
          this.hashedPassword = password 
          return axios.post(getUrl("user"), {
            ...this.user,
            password
          })
        })
        .then(() => {
          this.$emit("submit", this.hashedPassword);
        })
          .catch((e) => {
          console.log('error')
          if (!e.response.data) return console.error(e);
          console.log("response error", e.response.data.errors);
          this.invalidFields = e.response.data.errors.map(({
            param
          }) => param);
        });
    },
  },
  components: {
    Modal
  },
};
</script>

<style>
</style>
