import { GameState } from "../Classes/GameState";
import { Modifier } from "../Classes/Modifier";

export interface Entity {
   doSomething(gameState:GameState): Promise<Modifier> 
}