import { Player } from "../GameObjects/Player";
import { Move } from "../Other/Move";
import { Hand } from "../Other/Hand";
import { Pawn } from "../GameObjects/Pawn";
import { IdProvider } from "../../Interfaces/IdProvider";

export class ListenerPlayer extends Player {

    constructor(
        readonly hand: Hand,
        readonly pawns: [ Pawn ],
        readonly team:number,
        idProvider:IdProvider
    ) {
        super(hand, pawns, team, idProvider);
    }

    
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