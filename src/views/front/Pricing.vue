<template>
  <div>
    <Header />
    <div class="pt-6 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2
            class="text-3xl font-extrabold tracking-tight text-coolGray-800 dark:text-blueGray-200 sm:text-4xl"
          >{{ $t("front.pricing.title") }}</h2>
          <p class="mt-4 text-lg leading-6 text-gray-500">{{ $t("front.pricing.headline") }}</p>
        </div>
        <Plans />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Header from "@/components/front/Header.vue";
import Plans from "@/components/front/Plans.vue"
import Footer from "@/components/front/Footer.vue";
import i18n from '@/locale/i18n';

@Component({
  metaInfo: {
    title: i18n.t("front.pricing.title").toString(),
  },
  components: {
    Header,
    Plans,
    Footer,
  },
})
export default class Pricing extends Vue {
}
</script>
