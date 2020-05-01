import { GameObject } from "./GameObject";
import { Vec2 } from "../../Types/Vec2";
import { IdProvider } from "../../Interfaces/IdProvider";
import { CopyIdProvider } from "../IdProviders/CopyIdProvider";

export class Board extends GameObject {
    constructor(
        readonly maxCrd:Vec2,
        readonly slippery:Vec2[],
        readonly obstructed:Vec2[],
        readonly shiftMap:Vec2[][],
        idProvider:IdProvider
    ) {
        super(idProvider);
    }

    copy():Board {
        const slipperyCopy: Vec2[] = Object.assign([], this.slippery);
        const obstructedCopy: Vec2[] = Object.assign([], this.obstructed);
        const shiftMapCopy: Vec2[][] = [];
        this.shiftMap.forEach(row => shiftMapCopy.push(Object.assign([], row)));
        return new Board(
            this.maxCrd,
            slipperyCopy,
            obstructedCopy,
            shiftMapCopy,
            CopyIdProvider.getYours(this)
        )
    }
}