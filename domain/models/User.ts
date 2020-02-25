export interface UserJson {
  uid: string
  name: string
}

export class User {
  uid: string
  name: string

  constructor(json: UserJson) {
    this.uid = json.uid
    this.name = json.name
  }

}
