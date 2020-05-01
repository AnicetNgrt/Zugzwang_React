import { CardType, CardTypeData } from "../../Interfaces/CardType";
import { Player } from "../GameObjects/Player";
import { GameState } from "../Other/GameState";
import { Action } from "../../Types/Action";
import { Hidable } from "../../Interfaces/Hidable";

export class FlickeringCardType implements CardType, Hidable {
    readonly shown: boolean = false;

    constructor(
        readonly data:CardTypeData
    ) {}

    getPlayableFor(player: Player, gameState: GameState): Action[] {
        return [];
    }
}