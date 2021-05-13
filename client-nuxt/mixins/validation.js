import Vue from 'vue'
Vue.mixin({
  data(){
    return{
      invalidFields: []
    }
  },
  methods: {
    validation(e) {
      this.invalidFields = [];
      if (!e.response || !e.response.data) return console.error(e);
      e.response.data.errors
      .filter(e => typeof e === 'string')
      .forEach(error => console.error(error))

      this.invalidFields = e.response.data.errors
      .filter(e => typeof e === 'object')
      .reduce((invalidFields, {
        nestedErrors, param, msg
      }) => 
        invalidFields.concat(nestedErrors ? nestedErrors.map(e => e): {param, msg})
      , []);
      console.log('invalid',this.invalidFields)
    },
    getMessage(fieldname){
      return this.invalidFields
      .filter(({param}) => param === fieldname)
      .map(({msg}) => msg)[0];
    },
    getInputType(fieldname){
      return this.getMessage(fieldname) ? { 'is-danger': 'hasError' }: ""
    }
  }
})