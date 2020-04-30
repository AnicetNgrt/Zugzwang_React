import { GameState } from "../Classes/Other/GameState";import { Player } from "../Classes/Abstract/Player";
import { Modifier } from "../Classes/Other/Modifier";

export type ModifierGenerator = (player:Player, gameState:GameState) => Modifier[];