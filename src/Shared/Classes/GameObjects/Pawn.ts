import { GameObject } from "./GameObject";
import { IdProvider } from "../../Interfaces/IdProvider";
import { CopyIdProvider } from "../IdProviders/CopyIdProvider";

export enum PawnState {
    FINE = "This pawn is alive",
    EXILED = "This pawn is exiled",
    DEAD = "This pawn is dead"
}

export class Pawn extends GameObject {

    state:PawnState

    constructor(
        idProvider:IdProvider,
        state:PawnState,
        readonly x:number,
        readonly y:number
        ) {
        super(idProvider);
        this.state = state;
    }

    distanceTo(pawn:Pawn) {
        return Math.abs(pawn.x - this.x) + Math.abs(pawn.y - this.y);
    }

    copy():Pawn {
        return new Pawn(
            CopyIdProvider.getYours(this),
            this.state,
            this.x,
            this.y
        );
    }
}