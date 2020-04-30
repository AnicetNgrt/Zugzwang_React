import { Player } from "../Interfaces/Player";

export class GameState {
    constructor(readonly players: [Player]) {}
}