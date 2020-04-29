import { Action } from "../ZwangInterfaces/Action";
import { GameState } from "../ZwangClasses/GameState";
import { Player } from "./Player";

export interface CardType {
    readonly weight: number;
    readonly name:string;
    readonly picturePath:string | null;
    readonly maxTurn:number;
    readonly maxGame:number;
    readonly shown:boolean;
    readonly actions:Action[];
    
    getPlayableFor(player:Player, gameState:GameState): Action[];
}