import { GameState } from "../Classes/Other/GameState";
import { Modifier } from "../Classes/Other/Modifier";

export interface Entity {
   doSomething(gameState:GameState): Promise<Modifier> 
}