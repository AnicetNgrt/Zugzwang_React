import { GameState } from "../ZwangClasses/GameState";
import { Hand } from "../ZwangClasses/Hand";
import { Pawn } from "../ZwangClasses/GameObjects/Pawn";
import { Move } from "../ZwangClasses/Move";

export interface Player {
    readonly hand:Hand;
    readonly pawns: [ Pawn ];
    hasLost():Boolean;
    play(gameState:GameState):Promise<Move>;
}

