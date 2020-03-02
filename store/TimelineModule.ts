import { Mutation, Action, VuexModule, Module } from "vuex-module-decorators"
import { db } from "@/plugins/firebase"

import { StatusJson, Status } from "~/domain/models/Status"
import { UserDocumentSnapshot, User } from "~/domain/models/User"
import { DocumentReference } from "@google-cloud/firestore"

const TIMELINE_LOAD_LIMIT = 30

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

  get lastStatus() {
    if (this.statuses.length === 0) {
      return null
    }
    return this.statuses[this.statuses.length - 1]
  }

  @Action({ rawError: true })
  async fetchGlobalTimeline(params?: { clear: boolean }) {
    if (params && params.clear) {
      this.CLEAR_STATUSES()
    }

    const lastDate = this.lastStatus ? this.lastStatus.createdAt : new Date(99999999999999)
    const statusesSnapShot = await db
      .collectionGroup("statuses")
      .orderBy("createdAt", "desc")
      .startAfter(lastDate)
      .limit(TIMELINE_LOAD_LIMIT)
      .get()

    const statuses = await Promise.all(
      statusesSnapShot.docs
        .map(async statusDoc => {
          const status = statusDoc.data()
          const authorRef: DocumentReference = status.authorRef
          const authorDoc: UserDocumentSnapshot = await authorRef.get()
          const author = ({
            id: authorDoc.id,
            ...authorDoc.data(),
          })
          return {
            id: statusDoc.id,
            text: status.text,
            createdAt: status.createdAt,
            author,
          }
        })
    )

    this.ADD_STATUSES(statuses)
  }

  @Action
  async fetchLocalTimeline(params: { currentUser: User, clear?: boolean }) {
    if (params && params.clear) {
      this.CLEAR_STATUSES()
    }

    // ステータスのIDリストの取得
    const lastDate = this.lastStatus ? this.lastStatus.createdAt : new Date(99999999999999)
    const timelineSnapShot = await db
      .collection("users").doc(params.currentUser.id).collection("timeline")
      .orderBy("createdAt", "desc")
      .startAfter(lastDate)
      .limit(TIMELINE_LOAD_LIMIT)
      .get()

    // ステータスの取得
    let statuses: any = await Promise.all(
      timelineSnapShot.docs.map(async timelineDoc => {
        const statusRef: DocumentReference = timelineDoc.data().statusRef
        const statusDoc = await statusRef.get()
        const statusData = statusDoc.data() || {}

        const authorRef: DocumentReference = statusData.authorRef
        const authorDoc = await authorRef.get()
        const author = ({
          id: authorDoc.id,
          ...authorDoc.data(),
        })

        return {
          id: statusDoc.id,
          text: statusData.text,
          createdAt: statusData.createdAt,
          author,
        }
      })
    )

    this.ADD_STATUSES(statuses)
  }

  @Action
  async postStatus(params: { text: string, currentUser: User }) {
    const uid = params.currentUser.id
    const currentUserRef = db.collection("users").doc(uid)
    currentUserRef.collection("statuses").add({
      text: params.text,
      createdAt: new Date(),
      authorRef: currentUserRef,
    })
  }

  @Mutation
  private CLEAR_STATUSES() {
    this._statuses = []
  }

  @Mutation
  private ADD_STATUSES(statuses: StatusJson[]) {
    this._statuses.push(...statuses)
  }

}
