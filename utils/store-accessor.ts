import { Store } from "vuex"
import { getModule } from "vuex-module-decorators"
import AuthModule from "@/store/AuthModule"
import TimelineModule from "@/store/TimelineModule"
import UserModule from "@/store/UserModule"

let authModule: AuthModule
let timelineModule: TimelineModule
let userModule: UserModule

function initialiseStores(store: Store<any>): void {
  authModule = getModule(AuthModule, store)
  timelineModule = getModule(TimelineModule, store)
  userModule = getModule(UserModule, store)
}

export {
  initialiseStores,
  authModule,
  timelineModule,
  userModule,
}
