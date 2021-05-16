<template>
  <b-field>
    <template #label>
      {{ label }}
      <b-tooltip
        type="is-dark"
        position="is-right"
        multilined
        :label="tooltip"
      >
        <b-icon
          size="is-small"
          type="is-warning"
          icon="help-circle-outline"
        ></b-icon>
      </b-tooltip>
    </template>
    <slot />
  </b-field>
</template>

<script>
export default {
  name: "FormModal",
  props: { label: String, tooltip: String },
};
</script>