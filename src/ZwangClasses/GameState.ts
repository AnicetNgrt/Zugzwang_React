import { Player } from "../ZwangInterfaces/Player";

export class GameState {
    constructor(readonly players: [Player]) {}
}