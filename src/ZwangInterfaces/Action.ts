import { Player } from "./Player";
import { Modifier } from "./Modifier";

export interface Action {
    readonly cost:number;
    readonly modifier:Modifier;
    
    playableFor(player:Player): boolean;
}