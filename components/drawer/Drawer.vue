<template lang="pug">
v-navigation-drawer(app clipped stateless :value="loggedIn")
  v-card(flat)
    v-card-title 新しい投稿
    v-card-text
      v-textarea(v-model="text" outlined label="テキスト" counter)
    v-card-actions
      v-btn(block color="primary" @click="post") 投稿
</template>

<script lang="ts">
import Vue from "vue"
import { Component } from "nuxt-property-decorator"
import { timelineModule, authModule } from "@/store"

@Component({})
export default class extends Vue {
  text = ""

  get loggedIn() {
    return authModule.loggedIn
  }

  async post() {
    timelineModule.postStatus({
      text: this.text,
      currentUser: authModule.currentUser,
    }).then(_ => {
      this.text = ""
    })
  }
}
</script>

<style lang="sass" scoped>
</style>
