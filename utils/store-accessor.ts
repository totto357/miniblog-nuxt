import { Store } from "vuex"
import { getModule } from "vuex-module-decorators"
import AuthModule from "@/store/AuthModule"
import TimelineModule from "@/store/TimelineModule"

let authModule: AuthModule
let timelineModule: TimelineModule

function initialiseStores(store: Store<any>): void {
  authModule = getModule(AuthModule, store)
  timelineModule = getModule(TimelineModule, store)
}

export {
  initialiseStores,
  authModule,
  timelineModule,
}
