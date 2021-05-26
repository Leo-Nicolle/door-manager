import Vue from 'vue'
Vue.mixin({
  methods: {
    yesNo: function (query) {
      const yes = Math.min(
        ...["true", "yes", "oui", "vrai"].map((w) =>
          this.stringDist(query, w)
        )
      );
      const no = Math.min(
        ...["no", "non", "faux", "false"].map((w) =>
          this.stringDist(query, w)
        )
      );
      return yes < no;
    },
  }
});