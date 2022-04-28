<template>
  <div class="space-y-2 w-full">
    <EmptyState
      @new="alert('Clicked')"
      :captions="{
        new: 'Button',
        thereAreNo: 'There are no...',
        description: 'Description...',
      }"
      icon="plus"
    />
    <EmptyState
      :to="currentRoute"
      :captions="{
        new: 'Link',
        thereAreNo: 'There are no...',
        description: 'Description...',
      }"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import EmptyState from "./EmptyState.vue";

@Component({
  components: {
    EmptyState
  },
})
export default class PreviewEmptyStates extends Vue {
  alert(message) {
    window.alert(message)
  }
  get currentRoute() {
    return this.$route.path;
  }
}
</script>