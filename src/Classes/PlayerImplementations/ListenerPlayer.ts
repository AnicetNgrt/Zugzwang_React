import { Player } from "../Abstract/Player";
import { Move } from "../Other/Move";
import { Hand } from "../Other/Hand";
import { Pawn } from "../GameObjects/Pawn";

export class ListenerPlayer implements Player {

    constructor(
        readonly hand: Hand,
        readonly pawns: [ Pawn ]
    ) {}

    
    hasLost(): Boolean {
        throw new Error("Method not implemented.");
    }
    
    play(gameState: import("../Other/GameState").GameState): Promise<Move> {
        throw new Error("Method not implemented.");
    }

    fetchMove(): Promise<Move> {
        throw new Error("Method not implemented.");
    }
}