import { Mutation, Action, VuexModule, Module } from "vuex-module-decorators"
import { db } from "@/plugins/firebase"
import { UserJson, User } from "@/domain/models/User"
import { NotFoundError } from "@/errors/NotFoundError"

@Module({
  name: "UserModule",
  stateFactory: true,
  namespaced: true,
})
export default class UserModule extends VuexModule {

  _user: UserJson = {}
  isCurrentUser = false
  isFollowing = false

  get user() {
    return new User(this._user)
  }

  @Action({ rawError: true })
  async fetchUser(params: { currentUser: User, userId: string }) {
    const currentUser = params.currentUser
    const userId = params.userId

    this.SET_IS_CURRENT_USER(currentUser.id === userId)

    // プロフィールの取得
    const userSnapShot = await db.collection("users")
      .doc(userId)
      .get()
    if (!userSnapShot.exists) {
      throw new NotFoundError()
    }
    this.SET_USER({ id: userId, ...userSnapShot.data() } as UserJson);

    if (!currentUser) {
      return
    }

    // フォロー状態の取得
    const followedSnapshot = await db
      .collection("users").doc(currentUser.id)
      .collection("followings").doc(userId)
      .get()
    const isFollowing = followedSnapshot.exists
    this.SET_IS_FOLLOWING(isFollowing)
  }

  @Action({ rawError: true })
  async followUser(params: { currentUser: User, followedId: string }) {
    const currentUserId = params.currentUser.id
    const followedId = params.followedId

    const currentUserRef = db.collection("users").doc(currentUserId)
    const followedUserRef = db.collection("users").doc(followedId)

    const batch = db.batch()
    batch.set(
      currentUserRef.collection("followings").doc(followedId),
      { userRef: followedUserRef },
    )
    batch.set(
      followedUserRef.collection("followers").doc(currentUserId),
      { userRef: currentUserRef },
    )
    await batch.commit()

    this.SET_IS_FOLLOWING(true)
  }

  @Action({ rawError: true })
  async unFollowUser(params: { currentUser: User, followedId: string }) {
    const currentUserId = params.currentUser.id
    const followedId = params.followedId

    const batch = db.batch()
    batch.delete(db.collection("users").doc(currentUserId).collection("followings").doc(followedId))
    batch.delete(db.collection("users").doc(followedId).collection("followers").doc(currentUserId))
    await batch.commit()

    this.SET_IS_FOLLOWING(false)
  }

  @Action({ rawError: true })
  async updateUser(user: User) {
    const userJson = user.toJson()
    await db.collection("users")
      .doc(user.id)
      .set(userJson)

    this.SET_USER(userJson)
  }

  @Mutation
  private SET_USER(user: UserJson) {
    this._user = user
  }

  @Mutation
  private SET_IS_CURRENT_USER(isCurrentUser: boolean) {
    this.isCurrentUser = isCurrentUser
  }

  @Mutation
  private SET_IS_FOLLOWING(isFollowing: boolean) {
    this.isFollowing = isFollowing
  }

}
