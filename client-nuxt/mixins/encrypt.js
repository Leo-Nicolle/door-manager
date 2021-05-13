import quickEncrypt from "quick-encrypt";

import Vue from 'vue'
Vue.mixin({
  methods: {
    encrypt(toEncrypt = []) {
      const a = this.$axios.$get('/encrypt')
        .then(publicKey =>
          toEncrypt
            .filter(e => e && e.length)
            .map(str => {
              return quickEncrypt.encrypt(str, publicKey)
            })
        )
      console.log('toEncrypt',toEncrypt, a)
      return a;
    },
    decrypt(toDecrypt = []) {
      return this.$axios.$get('/encrypt')
        .then(publicKey => toDecrypt.map(str =>
          decrypt(str, publicKey)
        ))
    }
  }
})