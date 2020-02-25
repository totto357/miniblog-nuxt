<template lang="pug">
div.ma-6
  v-row.justify-center
    v-col(cols="12" sm="6" md="4")
      v-form.mb-3
        h2.text-center.mb-3 ログイン
        v-card
          v-card-text
            v-text-field(
              v-model="email"
              label="メールアドレス"
              type="email"
              :rules="emailRules"
            )
            v-text-field(
              v-model="password"
              label="パスワード"
              type="password"
              :rules="passwordRules"
            )
          v-card-actions
            v-btn(block color="primary" @click="signIn") ログイン

  v-row.justify-center
    v-col(cols="12" sm="6" md="4")
      v-btn(outlined block color="primary" to="/join") アカウントを新規登録
</template>

<script lang="ts">
import Vue from "vue"
import { Component } from "nuxt-property-decorator"
import { authModule } from "@/store"

@Component({})
export default class extends Vue {
  email = ""
  password = ""

  get emailRules() {
    return [
      v => !!v || "メールアドレスは必須です",
      v =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "適切なメールアドレスを入力してください"
    ]
  }

  get passwordRules() {
    return [
      v => !!v || "パスワードは必須です",
      v => (v && v.length >= 6) || "パスワードは6文字以上です"
    ]
  }

  async signIn() {
    authModule
      .signIn({
        email: this.email,
        password: this.password
      })
      .then(_ => this.$router.push("/timeline/local"))
  }
}
</script>

<style lang="sass" scoped>
</style>
