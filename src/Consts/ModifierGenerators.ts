import { ModifierGenerator } from "../Types/ModifierGenerator";
import { Player } from "../Classes/GameObjects/Player";
import { GameState } from "../Classes/Other/GameState";
import { Modifier } from "../Classes/Other/Modifier";

export const ModifierGenerators:{[key:string]:ModifierGenerator} = {
    focus: (player:Player, gameState:GameState) => {
        if(player.effects.focus.level >= 1) return [];
        const mod = new Modifier({}, [
            
        ])       
        return [];
    }
}