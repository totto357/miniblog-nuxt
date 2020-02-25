import { Mutation, Action, VuexModule, Module } from "vuex-module-decorators"
import { db } from "@/plugins/firebase"

import { StatusJson, Status } from "~/domain/models/Status"
import { UserJson } from "~/domain/models/User"

@Module({
  name: "TimelineModule",
  stateFactory: true,
  namespaced: true,
})
export default class TimelineModule extends VuexModule {

  _statuses: StatusJson[] = []

  get statuses() {
    return this._statuses.map(s => new Status(s))
  }

  @Action({ rawError: true })
  async fetchGlobalTimeline() {
    const ss = await db
      .collectionGroup("statuses")
      .orderBy("createdAt", "desc")
      .get()

    const statuses = await Promise.all(
      ss.docs.map(statusDoc =>
        db.collection("users")
          .doc(statusDoc.data().userId)
          .get()
          .then(userDoc => ({
            id: statusDoc.id,
            text: statusDoc.data().text,
            createdAt: statusDoc.data().createdAt,
            user: {
              uid: userDoc.id,
              ...userDoc.data(),
            } as UserJson,
          }))
      )
    )

    this.SET_STATUSES(statuses)
  }

  @Action
  async postStatus(params: { text: string, currentUser: string }) {
    db.collection(`users/${params.currentUser}/statuses`).add({
      userId: params.currentUser,
      text: params.text,
      createdAt: new Date(),
    })
  }

  @Mutation
  private SET_STATUSES(statuses: StatusJson[]) {
    this._statuses = statuses
  }

}
