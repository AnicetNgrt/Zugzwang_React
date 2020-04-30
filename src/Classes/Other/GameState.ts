import { Player } from "../Abstract/Player";

export class GameState {
    constructor(readonly players: [Player]) {}
}