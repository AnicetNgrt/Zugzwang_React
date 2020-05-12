import { Action } from "../Classes/Other/Action";
import { ModifierConclusion, ModifierObjects } from "../Classes/Other/Modifier";
import { GameState } from "../Classes/GameObjects/GameState";
import { Player } from "../Classes/GameObjects/Player";

export interface CardTypeData {
    readonly weight: number,
    readonly name: string,
    readonly picturePath: string | undefined,
    readonly maxTurn: number,
    readonly maxGame: number,
    readonly actions: Action[]
}

export interface CardType {
    readonly data: CardTypeData;
    play(gameState: GameState, actionIndex: number, player: Player, objects: ModifierObjects): ModifierConclusion;
}