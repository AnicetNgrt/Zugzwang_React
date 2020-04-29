import { GameState } from "../ZwangClasses/GameState";
import { GameObject } from "../ZwangClasses/GameObjects/GameObject";

export interface Modifier {
    findPossibilities(gameState:GameState): [{ 
        endReason:string;
        impacted: [{
            old:GameObject;
            new:GameObject;
        }];
    }];
}