import { Mutation, Action, VuexModule, Module } from "vuex-module-decorators"
import { auth, db } from "@/plugins/firebase"
import { UserJson, User } from "~/domain/models/User"

@Module({
  name: "AuthModule",
  stateFactory: true,
  namespaced: true,
})
export default class AuthModule extends VuexModule {
  ready = false
  _user: UserJson = {}

  get currentUser() {
    return new User(this._user)
  }

  get loggedIn() {
    return !!this._user.id
  }

  @Action({ rawError: true })
  async createUser(params: { name: string, email: string, password: string }) {
    const credential = await auth.createUserWithEmailAndPassword(
      params.email,
      params.password,
    )
    const authUser = credential.user
    if (authUser) {
      const uid = authUser.uid
      const user = {
        name: params.name,
        createdAt: new Date(),
      }
      await db.collection("users").doc(uid).set(user)
      this.SET_USER({ id: uid, ...user })
    }
  }

  @Action({ rawError: true })
  async signIn(params: { email: string, password: string }) {
    const credential = await auth.signInWithEmailAndPassword(params.email, params.password)
    const authUser = credential.user
    if (authUser) {
      await this.fetchUser(authUser)
    }
  }

  @Action({ rawError: true })
  async signOut() {
    await auth.signOut()
    this.CLEAR_USER()
  }

  @Action
  async fetchUser(authUser: firebase.User) {
    const uid = authUser.uid
    const user = await db.collection("users").doc(uid).get()
    this.SET_USER({ id: uid, ...user.data() })
  }

  @Action
  async updateUser(user: User) {
    this.SET_USER(user.toJson())
  }

  @Action({ rawError: true })
  async onAuthStateChanged(user: firebase.User | null) {
    user
      ? await this.fetchUser(user)
      : this.CLEAR_USER()

    this.SET_READY()
  }

  @Mutation
  private SET_USER(userJson: UserJson) {
    this._user = userJson
  }

  @Mutation
  private CLEAR_USER() {
    this._user = {}
  }

  @Mutation
  private SET_READY() {
    this.ready = true
  }
}
