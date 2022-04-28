<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div class="space-y-2 w-full">
    <div class="flex justify-between">
      <DropdownWithClick ref="dropdownLeft" :right="true" @click="alert('Dropdown click')">
        <template v-slot:button>Dropdown with Click</template>
        <template v-slot:options>
          <button
            type="button"
            class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
            role="menuitem"
            tabindex="-1"
            id="menu-item-0"
            @click="() => {
              $refs['dropdownLeft'].close();
              alert('Clicked')
            }"
          >
            <div>Button</div>
          </button>
          <router-link
            :to="currentRoute"
            class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
            role="menuitem"
            tabindex="-1"
            id="menu-item-1"
            @click.native="() => {
              $refs['dropdownLeft'].close();
            }"
          >
            <div>Link</div>
          </router-link>
        </template>
      </DropdownWithClick>
      <DropdownWithClick ref="dropdownRight" @click="alert('Dropdown click')">
        <template v-slot:button>Dropdown with Click</template>
        <template v-slot:options>
          <button
            type="button"
            class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
            role="menuitem"
            tabindex="-1"
            id="menu-item-0"
            @click="() => {
              $refs['dropdownRight'].close();
              alert('Clicked')
            }"
          >
            <div>Button</div>
          </button>
          <router-link
            :to="currentRoute"
            class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
            role="menuitem"
            tabindex="-1"
            id="menu-item-1"
            @click.native="() => {
              $refs['dropdownRight'].close();
            }"
          >
            <div>Link</div>
          </router-link>
        </template>
      </DropdownWithClick>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DropdownWithClick from "./DropdownWithClick.vue";

@Component({
  components: {
    DropdownWithClick
  },
})
export default class PreviewDropdownsWithClick extends Vue {
  $refs!: {
    dropdownLeft: DropdownWithClick;
    dropdownRight: DropdownWithClick;
  }
  alert(message) {
    window.alert(message)
  }
  get currentRoute() {
    return this.$route.path;
  }
}
</script>