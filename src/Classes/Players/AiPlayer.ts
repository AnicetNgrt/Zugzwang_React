import { Hand } from "../Other/Hand"
import { Pawn } from "../GameObjects/Pawn";
import { Player } from "../GameObjects/Player";
import { MoveSender } from "../../Interfaces/MoveSender";
import { IdProvider } from "../../Interfaces/IdProvider";

export class AiPlayer extends Player implements MoveSender {

    constructor(
        readonly hand: Hand,
        readonly pawns: [Pawn],
        idProvider:IdProvider
        ) {
            super(hand, pawns, idProvider);
        }

    sendMove(move: any): void {
        throw new Error("Method not implemented.");
    }
    
    hasLost(): Boolean {
        throw new Error("Method not implemented.");
    }
    
    play(gameState: import("../Other/GameState").GameState): Promise<any> {
        throw new Error("Method not implemented.");
    }

}