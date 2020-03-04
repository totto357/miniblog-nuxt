<template lang="pug">
v-navigation-drawer(app clipped stateless :value="loggedIn")
  v-form(ref="form" v-model="valid" lazy-validation)
    v-card(flat)
      v-card-title 新しい投稿
      v-card-text
        v-textarea(
          v-model="text"
          outlined
          label="テキスト"
          counter="140"
          :rules="textRules"
        )
      v-card-actions
        v-btn(
          block
          depressed
          color="primary"
          :disabled="!valid || !text"
          @click="post"
        ) 投稿
</template>

<script lang="ts">
import Vue from "vue"
import { Component } from "nuxt-property-decorator"
import { timelineModule, authModule } from "@/store"

@Component({})
export default class extends Vue {
  valid = false
  text = ""

  get textRules() {
    return [
      v => (v.length <= 140) || "テキストは140文字以内です"
    ]
  }

  get loggedIn() {
    return authModule.loggedIn
  }

  async post() {
    this.$nuxt.$loading.start()

    await timelineModule.postStatus({
      text: this.text,
      currentUser: authModule.currentUser,
    })
    this.$nuxt.$loading.finish()
    this.text = ""
  }
}
</script>

<style lang="sass" scoped>
</style>
