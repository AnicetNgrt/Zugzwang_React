import { GameState } from "../Classes/GameState";import { Player } from "./Player";
import { Modifier } from "../Classes/Modifier";

export type ModifierGenerator = (player:Player, gameState:GameState) => Modifier[];