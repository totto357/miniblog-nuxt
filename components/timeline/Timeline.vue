<template lang="pug">
div
  v-status.mb-3(v-for="status in statuses" :key="status.id" :status="status")
  v-btn(block outlined color="primary" @click="update") 更新
</template>

<script lang="ts">
import Vue from "vue"
import { Component, Prop } from "nuxt-property-decorator"
import { timelineModule, authModule } from "@/store"
import VStatus from "@/components/timeline/Status.vue"
import { Status } from "@/domain/models/Status"

@Component({
  components: {
    VStatus,
  }
})
export default class extends Vue {
  @Prop()
  statuses: Status[]

  update() {
    this.$emit("click:update")
  }
}
</script>

<style lang="sass" scoped>
</style>
