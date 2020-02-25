import { Mutation, Action, VuexModule, Module } from "vuex-module-decorators"
import { db } from "@/plugins/firebase"

export interface StatusState {
  statuses: any[]
}

@Module({
  name: "StatusModule",
  stateFactory: true,
  namespaced: true,
})
export default class StatusModule extends VuexModule implements StatusState {
  statuses: any[] = []

  @Action({ rawError: true })
  async fetchStatuses(currentUser: string) {
    const followings = await db.collection(`users/${currentUser}/followings`)
      .get()
      .then(snapshot => snapshot.docs.map(doc => doc.id))
    followings.push(currentUser)

    const ss = await db
      .collectionGroup("statuses")
      .where("userId", "in", followings)
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
            user: userDoc.data()
          }))
      )
    )

    this.SET_STATUSES(statuses)
  }

  @Mutation
  private SET_STATUSES(statuses: any[]) {
    this.statuses = statuses
  }
}
