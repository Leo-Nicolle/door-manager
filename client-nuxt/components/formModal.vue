<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">
          {{ title }}
        </p>
        <button type="button" class="delete" @click="$emit('close')" />
      </header>
      <section class="modal-card-body">
        <div
          v-for="(field, i) in schema.fields"
          :key="i"
          v-if="field.condition ? field.condition() : true"
        >
          <slot
            v-if="field.type === 'field-slot'"
            :name="field.name"
            :field="field"
          >
          </slot>
          <b-field
            v-else
            :label="field.label"
            :message="getMessage(field.model)"
            :type="getInputType(field.model)"
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

            <section v-else-if="field.type === 'buttons'" :class="field.class">
              <b-button
                v-for="(b, j) in field.buttons"
                :key="j"
                @click="b.click"
                :type="b.type"
                >{{ b.label }}</b-button
              >
            </section>

            <b-autocomplete
              rounded
              v-else-if="field.type === 'autocomplete'"
              v-model="item[field.model]"
              :data="filteredData"
              :placeholder="field.placeholder"
              icon="clock-time-four-outline"
              clearable
              @typing="(text) => field.getFilteredData(text)"
              @select="(option) => console.log(option)"
            >
              <template #empty>{{ field.placeholder }}</template>
            </b-autocomplete>

            <slot
              v-else-if="field.type === 'slot'"
              :name="field.name"
              :field="field"
            >
            </slot>

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
        </div>
      </section>
      <footer
        class="modal-card-foot is-full"
        style="justify-content: space-between"
      >
        <b-button
          v-if="buttons.find((b) => b === 'close')"
          label="Annuler"
          type="is-danger"
          @click="$emit('close')"
        />
        <b-button
          label="Suppirmer"
          v-if="buttons.find((b) => b === 'remove')"
          @click="$emit('remove', item)"
          type="is-dark"
        />
        <b-button
          label="Valider"
          v-if="buttons.find((b) => b === 'submit')"
          @click="$emit('submit', item)"
          type="is-primary"
        />
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  name: "FormModal",
  props: {
    title: String,
    item: Object,
    schema: Object,
    filteredData: Array,
    buttons: {
      type: Array,
      default: ["close", "remove", "submit"],
    },
  },
  data() {
    return {
      invalidFields: [],
    };
  },
  methods: {},
};
</script>
