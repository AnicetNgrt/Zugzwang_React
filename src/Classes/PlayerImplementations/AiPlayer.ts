import { SenderPlayer } from "../../Interfaces/SenderPlayer";
import { Hand } from "../Other/Hand"
import { Pawn } from "../GameObjects/Pawn";

export class AiPlayer implements SenderPlayer {

    constructor(
        readonly hand: Hand,
        readonly pawns: [Pawn
        ]) {

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