<template lang="pug">
div.ma-6
  v-row
    v-col.py-0(cols="12")
      v-btn.mb-3(block outlined @click="loadTimeline") タイムラインの更新
      status.mb-3(v-for="status in statuses" :key="status.id" :status="status")
</template>

<script lang="ts">
import Vue from "vue"
import { Component } from "nuxt-property-decorator"
import Status from "@/components/status/Status.vue"
import { timelineModule, authModule } from "@/store"

@Component({
  components: {
    Status,
  }
})
export default class extends Vue {

  fetch() {
    timelineModule.fetchGlobalTimeline()
  }

  get statuses() {
    return timelineModule.statuses
  }

  async loadTimeline() {
    timelineModule.fetchGlobalTimeline()
  }

}
</script>

<style lang="sass" scoped>
</style>
