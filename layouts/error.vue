<template lang="pug">
div
  v-row(justify="center")
    v-col(cols="auto")
      v-card(color="error" dark)
        v-card-title
          v-row(justify="center")
            v-icon(size="80px" color="white") mdi-alert
        v-card-title.pt-0 {{ error.message }}
</template>

<script lang="ts">
import Vue from "vue"
import { Component, Prop } from "nuxt-property-decorator"
import AppHeader from "@/components/header/Header.vue"
import { authModule } from "@/store"

@Component({
  components: {
    AppHeader,
  }
})
export default class extends Vue {
  @Prop() error: any
}
</script>

<style lang="sass" scoped>
</style>
