import { CardType, CardTypeData } from "../../Interfaces/CardType";
import { Player } from "../Abstract/Player";
import { GameState } from "../Other/GameState";
import { Action } from "../../Types/Action";

export class ShownCardType implements CardType {
    readonly shown: boolean = true;

    constructor(
        readonly data:CardTypeData
    ) {}

    getPlayableFor(player: Player, gameState: GameState): Action[] {
        return [];
    }
}