const levenshtein =  require('fast-levenshtein');

import Vue from 'vue'
Vue.mixin({
  methods: {
    stringDist: function (a,b) {
      return levenshtein.get(a,b)
    },
  }
});