import { Mutation, Action, VuexModule, Module } from "vuex-module-decorators"
import { auth, db } from "@/plugins/firebase"

@Module({
  name: "AuthModule",
  stateFactory: true,
  namespaced: true,
})
export default class AuthModule extends VuexModule {
  currentUser = ""

  get loggedIn() {
    return !!this.currentUser
  }

  @Action({ rawError: true })
  async createUser(params: { name: string, email: string, password: string }) {
    const credential = await auth.createUserWithEmailAndPassword(
      params.email,
      params.password,
    )
    const user = credential.user
    if (user) {
      this.SET_USER(user)

      // TODO Cloud Functionに移動する
      db.collection("users").doc(user.uid).set({
        name: params.name,
        createdAt: new Date(),
      })
    }
  }

  @Action({ rawError: true })
  async signIn(params: { email: string, password: string }) {
    const credential = await auth.signInWithEmailAndPassword(params.email, params.password)
    const user = credential.user
    if (user) {
      this.SET_USER(user)
      return user
    }
  }

  @Action({ rawError: true })
  async signOut() {
    await auth.signOut()
    this.CLEAR_USER()
  }

  @Action({ rawError: true })
  onAuthStateChanged(user: firebase.User | null) {
    user
      ? this.SET_USER(user)
      : this.CLEAR_USER()
  }

  @Mutation
  private SET_USER(user: firebase.User) {
    this.currentUser = user.uid
  }

  @Mutation
  private CLEAR_USER() {
    this.currentUser = ""
  }
}
