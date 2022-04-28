<template>
  <div class="relative inline-block text-left" v-click-outside="closedropDown">
    <button
      type="button"
      @click="dropDown = !dropDown"
      class="cursor-pointer select-none leading-6 font-medium focus:outline-none transition ease-in-out duration-150 px-3 py-1 rounded-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:text-gray-900 dark:focus:text-white"
    >
      <span>{{ $t("settings.preferences.language") }}</span>
    </button>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-class="transition ease-in duration-75"
      leaveFrleave-to-classom="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-show="dropDown || open"
        class="z-40 absolute mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none origin-top-right right-0"
      >
        <div
          class="rounded-sm bg-white dark:bg-blueGray-900 border border-primary shadow-xl"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          <button
            type="button"
            v-for="(language, index) in supportedLocales"
            @click="select(language.lang)"
            :key="index"
            class="w-full h-10 space-x-2 cursor-pointer truncate group flex items-center px-2 text-sm text-gray-900 dark:text-blueGray-300 hover:bg-blueGray-100 dark:bg-coolGray-900 transition ease-in-out duration-150 border-b border-primary"
            role="menuitem"
          >
            <div class="pl-1">{{ language.name }}</div>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import supportedLocales from "../../../locale/supportedLocales";
import i18n from "@/locale/i18n";

@Component({})
export default class LocaleSelector extends Vue {
  open = false
  dropDown = false;
  supportedLocales = supportedLocales;
  mounted() {
    this.dropDown = this.open;
  }
  closedropDown() {
    this.dropDown = false;
  }
  select(value) {
    this.closedropDown();
    localStorage.setItem("locale", value)
    i18n.locale = value;
  }
}
</script>


