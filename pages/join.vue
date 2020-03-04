<template lang="pug">
div
  v-snackbar(v-model="showError" color="error")
    span {{ error.message }}
    v-btn(dark icon @click="showError = false")
      v-icon mdi-close

  v-row(justify="center")
    v-col(cols="12" sm="8" md="4")
      v-form.mb-3(ref="form" v-model="valid" lazy-validation)
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
            v-btn(
              block
              color="primary"
              :disabled="!valid"
              @click="join"
            ) 新規登録

  v-row(justify="center")
    v-col(cols="12" sm="8" md="4")
      v-btn(outlined block color="primary" to="/login") ログイン
</template>

<script lang="ts">
import Vue from "vue"
import { Component } from "nuxt-property-decorator"
import { authModule } from "@/store"

@Component({})
export default class extends Vue {
  valid = false
  name = ""
  email = ""
  password = ""

  showError = false
  error: any = {}

  get nameRules() {
    return [
      v => !!v || "ニックネームは必須です",
      v => (v && v.length <= 50) || "ニックネームは50文字以内です"
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

  get form() {
    return this.$refs.form as Vue & { validate: () => boolean }
  }

  async validate({ redirect }) {
    if (authModule.loggedIn) {
      redirect("/timeline/local")
    }
    return true
  }

  async join() {
    if (!this.form.validate()) {
      return
    }

    this.$nuxt.$loading.start()

    authModule
      .createUser({
        name: this.name,
        email: this.email,
        password: this.password
      })
      .then(() => this.$router.push("/timeline/global"))
      .catch(error => {
        this.error = error
        this.showError = true
      })

    this.$nuxt.$loading.finish()
  }
}
</script>

<style lang="sass" scoped>
</style>
