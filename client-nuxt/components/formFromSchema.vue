<template>
      <section class="modal-card-body">
        <b-field
          v-for="(field, i) in schema.fields"
          :key="i"
          :label="field.label"
          :message="getMessage(field.model)"
          :type="getInputType(field.model)"
          v-if="field.condition ? field.condition() : true"
        >
          <b-taginput
            v-if="field.type === 'tag'"
            v-model="item[field.model]"
            :data="filteredData"
            :open-on-focus="true"
            autocomplete
            :field="field.model"
            icon="label"
            :placeholder="field.placeholder"
            @typing="(text) => field.getFilteredData(text)"
          >
            <template #empty> {{ field.placeholder }} </template>
          </b-taginput>
          <b-checkbox
            v-else-if="field.type === 'checkbox'"
            v-model="item[field.model]"
          >
            {{ field.label }}
          </b-checkbox>
          <section v-else-if="field.type === 'section'">
            
            <b-button  v-for="(item,j) in field.content " @click="field.click" type="is-primary">{{
              field.label
            }}</b-button>
          </section>
          <b-input
            v-else
            :type="field.type"
            :password-reveal="field.type === 'password'"
            :placeholder="field.placeholder || field.label"
            :message="getMessage(field.model)"
            :required="schema.required.find((r) => r === field.model)"
            v-model="item[field.model]"
          />
        </b-field>
      </section>
</template>

<script>
export default {
  name: "FormFromSchema",
  props: ["item", "schema", "selectedData", "filteredData"],
  data() {
    return {
      invalidFields: [],
    };
  },
  methods: {},
};
</script>
