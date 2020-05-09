import { GameObject } from "./GameObject";
import { IdProvider } from "../../Interfaces/IdProvider";
import { CopyIdProvider } from "../IdProviders/CopyIdProvider";
import { Vec2 } from "../../Types/Vec2";

export class Pawn extends GameObject {

    isAlive: boolean;
    isActive: boolean;
    isExiled: boolean;

    constructor(
        idProvider:IdProvider,
        readonly pos:Vec2
        ) {
        super(idProvider);
        this.isAlive = true;
        this.isExiled = false;
        this.isActive = true;
    }

    distanceTo(pawn:Pawn) {
        return Math.abs(pawn.pos.x - this.pos.x) + Math.abs(pawn.pos.y - this.pos.y);
    }

    copy(): Pawn {
        const pawn = new Pawn(
            CopyIdProvider.getYours(this),
            {x:this.pos.x, y:this.pos.y}
        );
        pawn.isActive = this.isActive;
        pawn.isAlive = this.isAlive;
        pawn.isExiled = this.isExiled;
        return pawn;
    }
}