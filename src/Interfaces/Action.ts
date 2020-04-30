import { Player } from "./Player";
import { ModifierGenerator } from "./ModifierGenerator";

export interface Action {
    readonly cost:number;
    readonly modifierGenerator:ModifierGenerator;
    
    playableFor(player:Player): boolean;
}