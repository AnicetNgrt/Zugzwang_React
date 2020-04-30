import { GameState } from "../ZwangClasses/GameState";
import { Modifier } from "../ZwangClasses/Modifier";

export interface Entity {
   doSomething(gameState:GameState): Promise<Modifier> 
}