import { CardType, CardTypeData } from "../../../Interfaces/CardType";
import { Player } from "../../../Interfaces/Player";
import { GameState } from "../../GameState";
import { Action } from "../../../Interfaces/Action";

export class ShownCardType implements CardType {
    readonly shown: boolean = true;

    constructor(
        readonly data:CardTypeData
    ) {}

    getPlayableFor(player: Player, gameState: GameState): Action[] {
        return [];
    }
}