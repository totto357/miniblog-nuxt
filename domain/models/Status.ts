import { User, UserJson } from "@/domain/models/User"
import { firestore } from "firebase"

export interface StatusJson {
  id: string
  text: string
  createdAt: firestore.Timestamp,
  author: UserJson
}

export class Status {
  id: string
  text: string
  createdAt: Date
  author: User

  constructor(json: StatusJson) {
    this.id = json.id
    this.text = json.text
    this.createdAt = json.createdAt.toDate()
    this.author = new User(json.author)
  }
}
