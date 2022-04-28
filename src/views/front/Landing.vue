<template>
  <div
    class="relative overflow-hidden bg-white dark:bg-gray-900 text-coolGray-800 dark:text-blueGray-200"
  >
    <Hero />
    <Features class="relative z-10" />
    <JoinNow />
    <Faq />
    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Hero from "@/components/front/Hero.vue";
import Features from "@/components/front/Features.vue"
import JoinNow from "@/components/front/JoinNow.vue";
import Footer from "@/components/front/Footer.vue";
import Faq from "@/components/front/Faq.vue";

@Component({
  metaInfo: {
    title: "Vue2 SaasFrontend",
    titleTemplate: undefined
  },
  components: {
    Hero,
    Features,
    JoinNow,
    Footer,
    Faq
  },
})
export default class Landing extends Vue {
}
</script>
