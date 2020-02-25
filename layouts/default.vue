<template lang="pug">
v-app#app
  app-header
  drawer

  v-content
    v-container.pa-0(fluid)
      nuxt
</template>

<script lang="ts">
import Vue from "vue"
import { Component } from "nuxt-property-decorator"
import AppHeader from "@/components/header/Header.vue"
import Drawer from "@/components/drawer/Drawer.vue"

@Component({
  components: {
    AppHeader,
    Drawer,
  }
})
export default class extends Vue {}
</script>

<style lang="sass" scoped>
</style>
