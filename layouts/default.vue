<template lang="pug">
v-app#app
  v-overlay(:value="!isReady")

  app-header
  drawer

  v-content
    v-container.pa-4
      nuxt
</template>

<script lang="ts">
import Vue from "vue"
import { Component } from "nuxt-property-decorator"
import AppHeader from "@/components/header/Header.vue"
import Drawer from "@/components/drawer/Drawer.vue"
import { authModule } from "@/store"

@Component({
  components: {
    AppHeader,
    Drawer,
  }
})
export default class extends Vue {
  get isReady() {
    return authModule.ready
  }
}
</script>

<style lang="sass" scoped>
</style>
