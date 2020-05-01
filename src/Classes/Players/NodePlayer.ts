import { ListenerPlayer } from "./ListenerPlayer";
import { Move } from "../Other/Move";
import { Hand } from "../Other/Hand";
import { Pawn } from "../GameObjects/Pawn";
import { MoveSender } from "../../Interfaces/MoveSender";

export class NodePlayer extends ListenerPlayer implements MoveSender {

    constructor(
        hand: Hand,
        pawns: [ Pawn ]
    ) {
        super(hand, pawns);
    }

    hasLost(): Boolean {
        throw new Error("Method not implemented.");
    }
    play(gameState: import("../Other/GameState").GameState): Promise<Move> {
        throw new Error("Method not implemented.");
    }
    sendMove(move: Move): void {
        throw new Error("Method not implemented.");
    }
}