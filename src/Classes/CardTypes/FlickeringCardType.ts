import { CardType, CardTypeData } from "../../Interfaces/CardType";
import { Player } from "../GameObjects/Player";
import { GameState } from "../Other/GameState";
import { Action } from "../../Types/Action";

export class FlickeringCardType implements CardType {
    shown: boolean = true;

    constructor(
        readonly data:CardTypeData
    ) {}

    getPlayableFor(player: Player, gameState: GameState): Action[] {
        return [];
    }
}