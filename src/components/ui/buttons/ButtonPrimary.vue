<template>
  <button
    v-if="!to"
    :type="type"
    @click="$emit('click')"
    :disabled="disabled"
    class="inline-flex items-center space-x-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
    :class="{
      'cursor-not-allowed opacity-75': disabled,
      'bg-theme-600': !destructive,
      'bg-red-600': destructive,
      'hover:bg-theme-700 focus:ring-theme-500': !disabled && !destructive,
      'hover:bg-red-700 focus:ring-red-500': !disabled && destructive
    }"
  >
    <slot />
  </button>
  <router-link
    v-else
    :to="to"
    :disabled="disabled"
    :target="target"
    class="inline-flex items-center space-x-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white"
    :class="{
      'cursor-not-allowed opacity-75': disabled,
      'focus:outline-none focus:ring-2 focus:ring-offset-2': !disabled,
      'bg-theme-600': !destructive,
      'bg-red-600': destructive,
      'hover:bg-theme-700 focus:ring-theme-500': !disabled && !destructive,
      'hover:bg-red-700 focus:ring-red-500': !disabled && destructive
    }"
  >
    <slot />
  </router-link>
</template>

<script>
export default {
  props: ["type", "to", "target", "disabled", "destructive"]
};
</script>

<style>
</style>