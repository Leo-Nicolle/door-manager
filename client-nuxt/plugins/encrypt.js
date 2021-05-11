import quickEncrypt from "quick-encrypt";

import Vue from 'vue'
Vue.mixin({
  methods: {
    encrypt(toEncrypt = []) {
      return this.$axios.$get('/encrypt')
        .then(publicKey => {
          console.log('public', publicKey)
          return toEncrypt
          .filter(e => e && e.length)
          .map(str =>
            quickEncrypt.encrypt(str, publicKey)
          )
        })
    },
    decrypt(toDecrypt = []) {
      return this.$axios.$get('/encrypt')
        .then(publicKey => toDecrypt.map(str =>
          decrypt(str, publicKey)
        ))
    }
  }
})