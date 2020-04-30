import { GameState } from "../Other/GameState";
import { Hand } from "../Other/Hand";
import { Pawn } from "../GameObjects/Pawn";
import { Move } from "../Other/Move";

export abstract class Player {
    constructor(
        readonly hand:Hand,
        readonly pawns: [ Pawn ]
    ) {}
    abstract hasLost():Boolean;
    abstract play(gameState:GameState):Promise<Move>;
}

