<template>
  <schema-form :schema="schema" v-model="formData"> </schema-form>
</template>
<script>
export default {
  name: "Card",
  data() {
    return {
      filteredGroups: [],
      schema: {
        title: "Person",
        type: "object",
        properties: {
          firstName: {
            type: "string",
            title: "Prenom",
            description: "Votre prenom",
            example: "Jaqueline",
          },
          lastName: {
            type: "string",
            title: "Nom",
            description: "Votre nom",
            example: "Michu",
          },

          groups: {
            type: "vueMultiSelect",
            // model: "library",
            // label: "Libraries",
            // placeholder: "Type to search or add tag",
            required: true,
            // validator: validators.required,
            selectOptions: {
              multiple: true,
              key: "code",
              label: "name",
              searchable: true,
              taggable: false,
              tagPlaceholder: "Add this as new tag",
              onNewTag: function (newTag, id, options, value) {
                const tag = {
                  name: newTag,
                  // Just for example needs as we use Array of Objects that should have other properties filled.
                  // For primitive values you can simply push the tag into options and selected arrays.
                  code:
                    newTag.substring(0, 2) +
                    Math.floor(Math.random() * 10000000),
                };
                options.push(tag);
                value.push(tag);
              },
            },
            onChanged: function (model, newVal, oldVal, field) {
              console.log("@tag: ", newVal);
            },
            values: [
              {
                name: "Javascript",
                code: "js",
              },
              {
                name: "Monterail",
                code: "pl",
              },
              {
                name: "Open Source",
                code: "os",
              },
              {
                name: "Vue.js",
                code: "vu",
              },
            ],
          },
        },
        required: ["firstName"],
      },
      formData: {},
    };
  },
  methods: {
    getFilteredGroups() {
      return [];
    },
    displayData() {
      alert(JSON.stringify(this.formData, null, 2));
    },
  },
};
</script>