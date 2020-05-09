import { CardType, CardTypeData } from "../../Interfaces/CardType";
import { Player } from "../GameObjects/Player";
import { GameState } from "../Other/GameState";
import { Action } from "../Other/Action";
import { Hidable } from "../../Interfaces/Hidable";

export class ShownCardType implements CardType, Hidable {
    readonly shown: boolean = true;

    constructor(
        readonly data:CardTypeData
    ) {}

    getPlayableFor(player: Player, gameState: GameState): Action[] {
        return [];
    }
}