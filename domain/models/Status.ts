import { User, UserJson } from "@/domain/models/User"
import { firestore } from "firebase"

export interface StatusJson {
  id: string
  text: string
  createdAt: firestore.Timestamp,
  user: UserJson
}

export class Status {
  id: string
  text: string
  createdAt: Date
  user: User

  constructor(json: StatusJson) {
    this.id = json.id
    this.text = json.text
    this.createdAt = json.createdAt.toDate()
    this.user = new User(json.user)
  }
}
