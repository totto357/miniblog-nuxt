export class NotFoundError extends Error {
  name = "NotFoundError"

  constructor(message?: string) {
    super(message || "This page could not be found")
  }
}
