import { GameObject } from "./GameObject";
import { IdProvider } from "../../ZwangInterfaces/IdProvider";

export enum PawnState {
    FINE = "This pawn is alive",
    EXILED = "This pawn is exiled",
    DEAD = "This pawn is dead"
}

export class Pawn extends GameObject {

    constructor(
        idProvider:IdProvider,
        readonly state:PawnState
        ) {
        super(idProvider);
    }

    static getDefault(idProvider:IdProvider): Pawn {
        return new Pawn(idProvider, PawnState.FINE);
    }
}