import { Player } from "../GameObjects/Player";

export class GameState {
    constructor(readonly players: [Player]) {}
}