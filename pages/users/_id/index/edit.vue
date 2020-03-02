<template lang="pug">
v-dialog(
  v-model="dialog"
  @click:outside="close"
  max-width="500px"
)
  v-form(v-model="valid" lazy-validation)
    v-card
      v-card-title
        v-row(align="center" justify="space-between" no-gutters)
          span プロフィールを編集
          v-btn(@click="close" icon color="primary")
            v-icon mdi-close
      v-card-text
        v-text-field(
          v-model="user.name"
          label="ニックネーム"
          filled
          required
          counter="50"
          :rules="nameRules"
        )
        v-text-field(
          v-model="user.blogUrl"
          label="ブログURL"
          filled
        )
        v-textarea(
          v-model="user.profile"
          label="プロフィール"
          filled
          counter="200"
        )
      v-card-actions
        v-btn(block color="primary" depressed :disabled="!valid" @click="updateProfile") 保存
</template>

<script lang="ts">
import Vue from "vue"
import { Component } from "nuxt-property-decorator"
import { authModule, userModule } from "@/store"
import { User } from "@/domain/models/User"

@Component({})
export default class extends Vue {
  dialog = true
  valid = false
  user: User

  get nameRules() {
    return [
      v => !!v || "ニックネームは必須です",
      v => (v && v.length <= 50) || "ニックネームは50文字以内です"
    ]
  }

  async validate({ params }) {
    return authModule.currentUser.id === params.id
  }

  async asyncData({ params }) {
    await userModule.fetchUser({
      currentUser: authModule.currentUser,
      userId: params.id,
    })
    return {
      user: userModule.user.clone(),
    }
  }

  close() {
    this.$router.back()
  }

  async updateProfile() {
    await userModule.updateUser(this.user)
    await authModule.updateUser(this.user)
    this.close()
  }
}
</script>