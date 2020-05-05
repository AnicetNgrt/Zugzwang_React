export class Message {
  constructor(
    readonly author: {
      name: string,
      team: string
    },
    readonly content: string
  ) {}
}