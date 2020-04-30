import { GameState } from "../Classes/GameState";
import { Hand } from "../Classes/Hand";
import { Pawn } from "../Classes/GameObjects/Pawn";
import { Move } from "../Classes/Move";

export interface Player {
    readonly hand:Hand;
    readonly pawns: [ Pawn ];
    hasLost():Boolean;
    play(gameState:GameState):Promise<Move>;
}

