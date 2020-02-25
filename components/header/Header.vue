<template lang="pug">
v-app-bar(app fixed dark color="primary" clipped-left)
  v-toolbar-title.mr-2
    nuxt-link(to="/")
      .white--text ミニブログ

  template(v-if="!loggedIn")
    v-btn.mr-2(text to="/timeline/global") 全体タイムライン
    v-spacer
    v-btn.ml-2(text to="/login") ログイン
    v-btn.ml-2(outlined to="/join") 新規登録

  template(v-else)
    v-btn.mr-2(text to="/timeline/global") 全体タイムライン
    v-btn.mr-2(text to="/timeline/local") ローカルタイムライン
    v-spacer
    v-btn.ml-2(outlined @click="signOut") ログアウト

</template>

<script lang="ts">
import Vue from "vue"
import { Component } from "nuxt-property-decorator"
import { authModule } from "@/store"

@Component({})
export default class extends Vue {
  get loggedIn() {
    return authModule.loggedIn
  }

  signOut() {
    authModule.signOut().then(_ => this.$router.push("/"))
  }
}
</script>

<style lang="sass" scoped>
</style>
