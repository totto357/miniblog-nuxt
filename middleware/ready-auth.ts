import { User } from "firebase"
import { auth } from "@/plugins/firebase"
import { authModule } from "@/store"

export default function () {
  if (authModule.ready) {
    return true
  }

  return new Promise((resolve) => {
    auth.onAuthStateChanged((user: User | null) => {
      authModule.onAuthStateChanged(user)
        .then(() => resolve(true))
    })
  })
}
