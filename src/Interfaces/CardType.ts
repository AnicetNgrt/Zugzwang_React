import { Action } from "../Types/Action";
import { GameState } from "../Classes/Other/GameState";
import { Player } from "../Classes/GameObjects/Player";

export interface CardTypeData {
    readonly weight: number,
    readonly name: string,
    readonly picturePath: string | null,
    readonly maxTurn: number,
    readonly maxGame: number,
    readonly actions: Action[]
}

export interface CardType {
    readonly data:CardTypeData;
    
    getPlayableFor(player:Player, gameState:GameState): Action[];
}