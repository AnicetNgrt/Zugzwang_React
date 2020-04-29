import { CardType } from "../../ZwangInterfaces/CardType";
import { Player } from "../../ZwangInterfaces/Player";
import { GameState } from "../GameState";
import { Action } from "../../ZwangInterfaces/Action";

export class FlickeringCardType implements CardType {
    readonly shown: boolean = true;

    private constructor(
        readonly weight: number,
        readonly name: string,
        readonly picturePath: string | null,
        readonly maxTurn: number,
        readonly maxGame: number,
        readonly actions: Action[]
    ) {}

    getPlayableFor(player: Player, gameState: GameState): Action[] {
        return [];
    }

    protected static getDefault(): FlickeringCardType {
        return new FlickeringCardType(0, "unknown", null, 999, 999, []);
    }
}