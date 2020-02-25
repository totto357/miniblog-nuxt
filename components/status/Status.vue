<template lang="pug">
v-card
  v-card-title
    nuxt-link(:to="userPath") {{ status.user.name }}
    v-spacer
    span.caption.grey--text {{ status.createdAt | format }}
  v-card-text
    div.pre-line {{ status.text }}
</template>

<script lang="ts">
import Vue from "vue"
import DateFormat from "dateformat"
import { Component, Prop } from "nuxt-property-decorator"
import { Status } from "@/domain/models/Status"

@Component({
  filters: {
    format: (date: Date) => {
      return DateFormat(date, "yyyy/mm/dd HH:MM")
    }
  }
})
export default class extends Vue {

  @Prop() status: Status

  get userPath() {
    return `/users/${this.status.user.uid}`
  }

}
</script>

<style lang="sass" scoped>
.pre-line
  white-space: pre-line
</style>
