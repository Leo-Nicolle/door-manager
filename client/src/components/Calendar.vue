<template>
  <div>
    <VueCal
      :active-view="'week'"
      :hideTitleBar="true"
      :hideViewSelector="true"
      :locale="'fr'"
      :dragToCreateEvent="true"
      :editableEvents="{
      title: false,
      drag: true,
      resize: true,
      delete: true,
      create: true,
    }"
    ></VueCal>
    <button class="validate" @click="onSubmit()">valider</button>
  </div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/i18n/fr.js";
import "vue-cal/dist/vuecal.css";
import "vue-cal/dist/drag-and-drop.js";

export default {
  name: "Calendar",
  data() {
    return {
      events: [],
    };
  },
  methods: {
    onSubmit() {
      this.events = this.$children[0].mutableEvents.map(({ start, end }) => {
        return {
          start: {
            day: (start.getDay() + 1) % 7,
            hour: start.getHours(),
            minutes: start.getMinutes(),
          },
          end: {
            day: (end.getDay() + 1) % 7,
            hour: end.getHours(),
            minutes: end.getMinutes(),
          },
        };
      });
      console.log(this.events);
    },
  },
  components: { VueCal },
};
</script>
<style>
.vuecal__menu,
.vuecal__cell-events-count {
  background-color: #42b983;
}
.vuecal__title-bar {
  background-color: #e4f5ef;
}
.vuecal__cell--today,
.vuecal__cell--current {
  background-color: rgba(240, 240, 255, 0.4);
}
.vuecal:not(.vuecal--day-view) .vuecal__cell--selected {
  background-color: rgba(235, 255, 245, 0.4);
}
.vuecal__cell--selected:before {
  border-color: rgba(66, 185, 131, 0.5);
}
/* Cells and buttons get highlighted when an event is dragged over it. */
.vuecal__cell--highlighted:not(.vuecal__cell--has-splits),
.vuecal__cell-split--highlighted {
  background-color: rgba(195, 255, 225, 0.5);
}
.vuecal__arrow.vuecal__arrow--highlighted,
.vuecal__view-btn.vuecal__view-btn--highlighted {
  background-color: rgba(136, 236, 191, 0.25);
}
/* Events. */
.vuecal__event {
  background-color: rgba(66, 185, 131, 0.5);
}
</style>
