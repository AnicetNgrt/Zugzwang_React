import { CardType } from "../../ZwangInterfaces/CardType";
import { Action } from "../../ZwangInterfaces/Action";
import { Player } from "../../ZwangInterfaces/Player";
import { GameState } from "../GameState";

export class UnknownCardType implements CardType {
    constructor(
        readonly weight: number,
        readonly name: string,
        readonly picturePath: string | null,
        readonly maxTurn: number,
        readonly maxGame: number,
        readonly shown: boolean,
        readonly actions: Action[]
        ) {

    }

    getPlayableFor(player: Player, gameState: GameState): Action[] {
        return [];
    }
}