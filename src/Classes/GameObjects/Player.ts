import { GameState } from "../Other/GameState";
import { Hand } from "../Other/Hand";
import { Pawn } from "./Pawn";
import { Move } from "../Other/Move";
import { DefaultPlayerEffects } from "../../Consts/DefaultPlayerEffects";
import { IdProvider } from "../../Interfaces/IdProvider";
import { GameObject } from "./GameObject";
import { PlayerEffect } from "./PlayerEffect";

export abstract class Player extends GameObject {
    readonly effects:{[key:string]:PlayerEffect};

    constructor(
        readonly hand:Hand,
        readonly pawns: [ Pawn ],
        idProvider:IdProvider
    ) {
        super(idProvider);
        this.effects = DefaultPlayerEffects(idProvider)
    }
    
    abstract hasLost():Boolean;
    abstract play(gameState:GameState):Promise<Move>;
}

