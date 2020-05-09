import { GameState } from "./GameState";
import { Player } from "../GameObjects/Player";
import { Modifier } from "./Modifier";

export class Action {
    constructor(
        readonly cost: number,
        readonly name: string,
        readonly description: string,
        readonly modifiers: Modifier[]
    ) { }

    canBePlayed(gameState: GameState, player: Player): boolean {
        return player.ap >= this.cost;
    }
}