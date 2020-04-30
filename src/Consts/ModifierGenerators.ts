import { ModifierGenerator } from "../Types/ModifierGenerator";
import { Player } from "../Classes/Abstract/Player";
import { GameState } from "../Classes/Other/GameState";

export const ModifierGenerators:{[key:string]:ModifierGenerator} = {
    Bandage: (player:Player, gameState:GameState) => {
        return [];
    }
}