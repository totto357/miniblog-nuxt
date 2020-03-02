<template lang="pug">
v-row
  v-col.py-0(cols="12")
    v-timeline(:statuses="statuses" @click:update="loadTimeline")
</template>

<script lang="ts">
import Vue from "vue"
import { Component } from "nuxt-property-decorator"
import { timelineModule, authModule } from "@/store"
import VTimeline from "@/components/timeline/Timeline.vue"

@Component({
  components: {
    VTimeline,
  }
})
export default class extends Vue {

  validate() {
    return authModule.loggedIn
  }

  fetch() {
    return timelineModule.fetchLocalTimeline({
      currentUser: authModule.currentUser,
      clear: true,
    })
  }

  get statuses() {
    return timelineModule.statuses
  }

  async loadTimeline() {
    this.$nuxt.$loading.start()
    await timelineModule.fetchLocalTimeline({
      currentUser: authModule.currentUser,
    })
    this.$nuxt.$loading.finish()
  }

}
</script>

<style lang="sass" scoped>
</style>
