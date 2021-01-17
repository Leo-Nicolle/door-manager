<template>
  <Form :element="data" :onSubmit="onSubmit" :onDelete="null" :onCancel="onCancel">
    <div v-if="!getToken()" slot="body" class="body">
      <h3>Recevoir un mail pour reinitialiser votre mot de passe</h3>
      <label>
        email
        <input :class="getClass('email')" type="text" v-model="email" id="email" name="email" required />
      </label>
    </div>
    <div v-else  slot="body" class="body">
      <h3>Reinitialiser votre mot de passe</h3>
      <label>
        password
        <input :class="getClass('password')" type="password" v-model="password" id="password" name="password" required />
      </label>
      <label>
        confirm
        <input :class="getClass('confirm')" type="password" v-model="confirm" id="confirm" name="confirm" required />
      </label>
    </div>
  </Form>
</template>

<script>
import Form from "../mixins/Form";
import FormMixin from "../mixins/FormMixin";

import { getUrl } from "../js/utils";
import axios from "axios";
import encrypt from "quick-encrypt";

export default {
  name: "PasswordReset",
  data() {
    return {
      email: "",
      password: "",
      confirm: ""
    };
  },
  computed: {
    data: function(){return{email: this.email, password: this.password, confirm: this.confirm}}
  },
  mixins: [FormMixin],
  methods: {
    getToken(){
      return this.$route.params.token;
    },
    onCancel(){
      this.$router.push("/");
    },
    onSubmit(event) {
      event.preventDefault();
      event.stopPropagation();

      let promise;
      if(this.getToken()){
        promise = axios
        .get(getUrl("encrypt"))
        .then(({
          data
        }) => {
          const publicKey = data;
          return [
            this.password.length ?
            encrypt.encrypt(this.password, publicKey) :
            "",
            this.confirm.length ?
            encrypt.encrypt(this.confirm, publicKey) :
            ""]
        })
        .then(([password, confirm])=>
        axios.post(getUrl(`user/setpassword`),
        {token: this.$route.params.token, password, confirm})
        )
      
      }else{
       promise =  axios.post(getUrl(`user/resetpassword`),
        {email: this.email})
       
      }
        promise
        .then(() => {
          this.$router.push("/");
        })
        .catch(e => {
          if (!e.response.data) return console.error(e);
          console.log("response error", e.response.data.errors);
          this.invalidFields = e.response.data.errors.map(({
            param
          }) => param);
        })
    },
  },
  components: {
    Form
  }
};
</script>
<style></style>
