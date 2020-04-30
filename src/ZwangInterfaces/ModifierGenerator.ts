import { GameState } from "../ZwangClasses/GameState";import { Player } from "./Player";
import { Modifier } from "../ZwangClasses/Modifier";

export interface ModifierGenerator {
    generateAll(gameState:GameState, player:Player): Modifier[];
}