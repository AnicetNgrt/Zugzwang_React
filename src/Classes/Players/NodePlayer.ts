import { ListenerPlayer } from "./ListenerPlayer";
import { Move } from "../Other/Move";
import { Hand } from "../Other/Hand";
import { Pawn } from "../GameObjects/Pawn";
import { MoveSender } from "../../Interfaces/MoveSender";
import { IdProvider } from "../../Interfaces/IdProvider";

export class NodePlayer extends ListenerPlayer implements MoveSender {

    constructor(
        readonly hand: Hand,
        readonly pawns: [ Pawn ],
        readonly teams: number,
        idProvider:IdProvider
    ) {
        super(hand, pawns,teams,idProvider);
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