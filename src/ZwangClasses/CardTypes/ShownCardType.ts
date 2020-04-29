import { CardType } from "../../ZwangInterfaces/CardType";
import { Player } from "../../ZwangInterfaces/Player";
import { GameState } from "../GameState";
import { Action } from "../../ZwangInterfaces/Action";

export class ShownCardType implements CardType {
    readonly shown: boolean = true;

    constructor(
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

    static getDefault(): ShownCardType {
        return new ShownCardType(0, "unknown", null, 999, 999, []);
    }
}