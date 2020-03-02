import * as admin from "firebase-admin"
import * as functions from "firebase-functions"
import { DocumentReference } from "@google-cloud/firestore"
import * as _ from "lodash"

admin.initializeApp(functions.config().firebase)

export const db = admin.firestore()

const MAX_BATCH_SIZE = 500

/**
 * タイムラインにフォローしたユーザのステータスをコピーする
 */
export const updateTimelineAfterFollow =
  functions
    .firestore
    .document("users/{uid}/followings/{followedId}")
    .onCreate(async (snapshot, context) => {
      const uid = context.params.uid
      const followedId = context.params.followedId

      console.log(`User: ${uid} followed User: ${followedId}.`)

      // ステータスを取得
      // ここでは1回のバッチで処理できる数(500)までしか取得していないが
      // タイムラインはフォローしているユーザの最近の投稿を見ることが目的であり
      // そこまで多くの数を遡ることを想定していないので良しとする
      // (特定のユーザのタイムラインを見たければユーザページから見れば良い)
      const followedUserStatuses = (await db
        .collection(`users/${followedId}/statuses`)
        .orderBy("createdAt", "desc")
        .limit(MAX_BATCH_SIZE)
        .get()
      ).docs

      if (followedUserStatuses.length === 0) {
        return console.log(`User: ${followedId} has no statuses.`)
      }

      // タイムラインに書き込み
      const batch = db.batch()
      followedUserStatuses.forEach(status => {
        batch.set(
          db.collection(`users/${uid}/timeline`).doc(status.id),
          {
            createdAt: status.data().createdAt,
            statusRef: status.ref,
          }
        )
      })
      await batch.commit()
    })

/**
 * タイムラインからフォロー解除したユーザのステータスを削除する
 */
export const updateTimelineAfterUnFollow =
  functions
    .firestore
    .document("users/{uid}/followings/{followedId}")
    .onDelete(async (snapshot, context) => {
      const uid = context.params.uid
      const followedId = context.params.followedId

      console.log(`User: ${uid} unfollowed User: ${followedId}.`)

      // ステータスを取得
      const followedUserStatuses = (await db
        .collection("users").doc(followedId).collection("statuses")
        .orderBy("createdAt", "desc")
        .limit(MAX_BATCH_SIZE)
        .get()
      ).docs

      if (followedUserStatuses.length === 0) {
        return console.log(`User: ${followedId} has no statuses.`)
      }

      // タイムラインから削除
      const batch = db.batch()
      followedUserStatuses.forEach(status => {
        batch.delete(db.collection("users").doc(uid).collection("timeline").doc(status.id))
      })
      batch.commit()
    })

/**
 * 投稿した際にフォロワーのタイムラインに追加
 */
export const updateTimelineAfterPost =
  functions
    .firestore
    .document("users/{uid}/statuses/{statusId}")
    .onCreate(async (statusSnapshot, context) => {
      const uid = context.params.uid
      const authorRef = db.collection("users").doc(uid)

      const status = statusSnapshot.data() || {}
      const createdAt = status.createdAt || new Date()

      const followersSnapshot = await db.collection("users").doc(uid).collection("followers").get()
      const followerRefs = followersSnapshot.docs
        .map(followerDoc => followerDoc.data().userRef as DocumentReference)
        .concat(authorRef)

      // バッチで処理できる最大件数を超えることがあるので
      // 最大数で分割して実行する
      _.chunk(followerRefs, MAX_BATCH_SIZE)
        .map(chunkedfollowerRefs => {
          const batch = db.batch()
          chunkedfollowerRefs.forEach(followerRef => {
            batch.set(
              followerRef.collection("timeline").doc(statusSnapshot.id),
              {
                createdAt,
                statusRef: statusSnapshot.ref,
              }
            )
          })
          return batch.commit()
        })
    })
