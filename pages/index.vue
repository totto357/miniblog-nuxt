<template lang="pug">
div
  v-row(justify="center")
    v-col(cols="12" sm="8" md="4")
      v-btn.mb-3(block large color="primary" to="/timeline/global") 全体タイムラインを見る
      v-btn.mb-3(block large outlined color="secondary" to="/login") ログイン
      v-btn.mb-3(block large outlined color="primary" to="/join") 新規登録
</template>

<script lang="ts">
import Vue from "vue"
import { Component } from "nuxt-property-decorator"
import { authModule } from "@/store"

@Component({})
export default class extends Vue {}
</script>

<style lang="sass" scoped>
</style>
