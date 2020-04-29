import { Player } from "../../ZwangInterfaces/Player";
import { Move } from "../Move";
import { Hand } from "../Hand";
import { Pawn } from "../GameObjects/Pawn";

export class ListenerPlayer implements Player {

    constructor(
        readonly hand: Hand,
        readonly pawns: [ Pawn ]
    ) {}

    
    hasLost(): Boolean {
        throw new Error("Method not implemented.");
    }
    play(gameState: import("../GameState").GameState): Promise<Move> {
        throw new Error("Method not implemented.");
    }
    fetchMove(): Promise<Move> {
        throw new Error("Method not implemented.");
    }
}