<template lang="pug">
v-card(flat)
  v-card-title.pt-0
    v-list-item.pa-0
      v-list-item-content.pa-0
        v-list-item-title.font-weight-bold.title {{ user.name }}
        v-list-item-subtitle @{{ user.id }}
  v-card-text
    .d-flex(v-if="user.profile")
      p.pre-line {{ user.profile }}
    .d-flex.align-center(v-if="user.blogUrl")
      v-icon(small) mdi-link-variant
      span.ml-2
        a(:href="user.blogUrl" target="_blank" rel="noopener noreferrer") {{ user.blogUrl }}
  v-card-actions(v-if="loggedIn")
    v-btn(v-if="isCurrentUser" outlined color="primary" append to="edit") プロフィールを編集
    v-btn(v-else-if="isFollowing" depressed color="primary" @click="unFollow") フォロー中
    v-btn(v-else color="primary" outlined @click="follow") フォロー
    nuxt-child()
</template>

<script lang="ts">
import Vue from "vue"
import { Component } from "nuxt-property-decorator"
import { authModule, userModule } from "@/store"
import { User } from "@/domain/models/User"

@Component({})
export default class extends Vue {

  get loggedIn() {
    return authModule.loggedIn
  }

  get user() {
    return userModule.user
  }

  get isCurrentUser() {
    return userModule.isCurrentUser
  }

  get isFollowing() {
    return userModule.isFollowing
  }

  async asyncData({ params }) {
    await userModule.fetchUser({
      currentUser: authModule.currentUser,
      userId: params.id,
    })
  }

  async follow() {
    userModule.followUser({
      currentUser: authModule.currentUser,
      followedId: this.user.id,
    })
  }

  async unFollow() {
    userModule.unFollowUser({
      currentUser: authModule.currentUser,
      followedId: this.user.id,
    })
  }

}
</script>

<style lang="sass" scoped>
.pre-line
  white-space: pre-line
</style>
