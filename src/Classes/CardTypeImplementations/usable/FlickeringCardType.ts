import { CardType, CardTypeData } from "../../../Interfaces/CardType";
import { Player } from "../../../Interfaces/Player";
import { GameState } from "../../GameState";
import { Action } from "../../../Interfaces/Action";

export class FlickeringCardType implements CardType {
    shown: boolean = true;

    private constructor(
        readonly data:CardTypeData
    ) {}

    getPlayableFor(player: Player, gameState: GameState): Action[] {
        return [];
    }
}