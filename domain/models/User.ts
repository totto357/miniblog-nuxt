import { DocumentSnapshot } from "@google-cloud/firestore"

export interface UserJson {
  id?: string
  name?: string
  profile?: string
  blogUrl?: string
}

export interface UserDocumentData {
  name?: string
  profile?: string
  blogUrl?: string
}

export interface UserDocumentSnapshot extends DocumentSnapshot<UserDocumentData> {
  id: string
  data(): UserDocumentData | undefined
}

export class User {
  id: string
  name: string
  profile: string
  blogUrl: string

  constructor(json: UserJson = {}) {
    this.id = json.id || ""
    this.name = json.name || ""
    this.profile = json.profile || ""
    this.blogUrl = json.blogUrl || ""
  }

  toJson(): UserJson {
    return {
      id: this.id,
      name: this.name,
      profile: this.profile,
      blogUrl: this.blogUrl,
    }
  }

  clone() {
    return new User({
      id: this.id,
      name: this.name,
      profile: this.profile,
      blogUrl: this.blogUrl,
    })
  }
}
