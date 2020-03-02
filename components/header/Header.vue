<template lang="pug">
v-app-bar(app fixed dark color="primary" clipped-left)
  v-toolbar-title.mr-2
    nuxt-link(to="/")
      .white--text ミニブログ

  template(v-if="!loggedIn")
    v-btn.mr-2(text to="/timeline/global") 全体タイムライン
    v-spacer
    v-btn.ml-2(text :to="toLoginPage") ログイン
    v-btn.ml-2(outlined to="/join") 新規登録

  template(v-else)
    v-btn.mr-2(text to="/timeline/global") 全体タイムライン
    v-btn.mr-2(text to="/timeline/local") ローカルタイムライン
    v-spacer
    v-menu(offset-y)
      template(v-slot:activator="{ on }")
        v-btn.text-none(v-on="on" text)
          span {{ currentUser.name }}
          v-icon(right dark) mdi-menu-down
      template
        v-list(dense)
          v-list-item(:to="profilePage")
            v-list-item-title プロフィール
          v-list-item(@click="signOut")
            v-list-item-title ログアウト

</template>

<script lang="ts">
import Vue from "vue"
import { Component } from "nuxt-property-decorator"
import { authModule } from "@/store"

@Component({})
export default class extends Vue {
  get currentUser() {
    return authModule.currentUser
  }

  get loggedIn() {
    return authModule.loggedIn
  }

  get toLoginPage() {
    return {
      path: "/login",
      query: {
        origin: this.$route.fullPath
      }
    }
  }

  get profilePage() {
    return `/users/${authModule.currentUser.id}`
  }

  signOut() {
    authModule.signOut().then(_ => this.$router.push("/"))
  }
}
</script>

<style lang="sass" scoped>
</style>
