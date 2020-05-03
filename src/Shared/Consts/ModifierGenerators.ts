import { ModifierGenerator } from "../Types/ModifierGenerator";
import { Player } from "../Classes/GameObjects/Player";
import { GameState } from "../Classes/Other/GameState";
import { Modifier } from "../Classes/Other/Modifier";
import { Modification } from "../Classes/Other/Modification";
import { PlayerEffect } from "../Classes/GameObjects/PlayerEffect";
import { PawnState, Pawn } from "../Classes/GameObjects/Pawn";

function changeEffectLevel(effect:PlayerEffect, lvl:number):Modifier[] {
    if(effect.level == lvl) return [];

    const modified = effect.copy();
    modified.level = 1;

    const modifier = new Modifier([effect], [
        new Modification(effect, modified)    
    ]);

    return [modifier];
}

function tryKill(pawn:Pawn):boolean {
    if(pawn.state != PawnState.FINE) return false;
    pawn.state = PawnState.DEAD;
    return true;
}

function attacksAtaDistance(player:Player, gameState:GameState, distance:number):Modifier[] {
    const modifiers: Modifier[] = [];
    for(const pawn of player.pawns) {
        const foePawns = gameState.getEnemyPawns(player);
        const eligibles = foePawns.filter((foePawn, i, a)=>{
            return foePawn.distanceTo(pawn) <= distance;
        });
        for(const foePawn of eligibles) {
            const modified = foePawn.copy();
            if(!tryKill(modified)) break;
            modifiers.push(new Modifier([pawn, foePawn],[
                new Modification(foePawn, modified)
            ]));
        }
    }
    return modifiers;
}

export const ModifierGenerators:{[key:string]:ModifierGenerator} = {
    focus: (player:Player, gameState:GameState) => {
        return changeEffectLevel(player.effects.focus, 1);
    },
    unfocus: (player:Player, gameState:GameState) => {
        return changeEffectLevel(player.effects.focus, 0);
    },
    bowShot: (player:Player, gameState:GameState) => {
        if(player.effects.focus.level < 1) return [];
        return attacksAtaDistance(player, gameState, 2);
    },
    contact: (player:Player, gameState:GameState) => {
        return attacksAtaDistance(player, gameState, 1);
    }
}