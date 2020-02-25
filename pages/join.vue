<template lang="pug">
div.ma-6
  v-row.justify-center
    v-col(cols="12" sm="6" md="4")
      v-form.mb-3
        h2.text-center.mb-3 新規登録
        v-card
          v-card-text
            v-text-field(
              v-model="name"
              label="ニックネーム"
              :rules="nameRules"
            )
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
            v-btn(block color="primary" @click="join") 新規登録

  v-row.justify-center
    v-col(cols="12" sm="6" md="4")
      v-btn(outlined block color="primary" to="/join") アカウントを新規作成
</template>

<script lang="ts">
import Vue from "vue"
import { Component } from "nuxt-property-decorator"
import { authModule } from "@/store"

@Component({})
export default class extends Vue {
  name = ""
  email = ""
  password = ""

  get nameRules() {
    return [
      v => !!v || "ニックネームは必須です",
      v => /^([a-zA-Z]{1,20})$/.test(v) || "ニックネームはアルファベットのみ、スペース禁止、20文字以内です"
    ]
  }

  get emailRules() {
    return [
      v => !!v || "メールアドレスは必須です",
      v => /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(v) || "適切なメールアドレスを入力してください"
    ]
  }

  get passwordRules() {
    return [
      v => !!v || "パスワードは必須です",
      v => (v && v.length >= 6) || "パスワードは6文字以上です"
    ]
  }

  async join() {
    authModule
      .createUser({
        name: this.name,
        email: this.email,
        password: this.password
      })
      .then(_ => this.$router.push("/timeline/global"))
  }
}
</script>

<style lang="sass" scoped>
</style>
