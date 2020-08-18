export default {
  name: "Form",
  props: ["element"],
  data() {
    return {
      invalidFields: [],
    };
  },
  watch: {
    element: function() {
      this.fetch();
    },
  },
  methods: {
    getClass(fieldName) {
      return this.invalidFields.find((f) => f === fieldName) ? "invalid" : "";
    },
    onSubmit() {
      console.log("TODO");
    },
    onCancel(event) {
      event.stopPropagation();
      event.preventDefault();
      this.$emit("cancel");
    },
    onDelete() {
      console.log("TODO");
    },
    fetch() {},
  },
  mounted() {
    this.fetch();
  },
  components: {},
};
