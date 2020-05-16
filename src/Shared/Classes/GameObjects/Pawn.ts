import { GameObject } from "./GameObject";
import { IdProvider } from "../../Interfaces/IdProvider";
import { CopyIdProvider } from "../IdProviders/CopyIdProvider";
import { Vec2 } from "../../Types/Vec2";
import { ObjectsNames } from "./ObjectsNames";
import { GameState } from "./GameState";
import { Player } from "./Player";
import { ModifierConclusion } from "../Other/Modifier";
import { ModEffNames } from "../../Consts/Modifiers";

export class Pawn extends GameObject {
    isAlive: boolean;
    isActive: boolean;
    isExiled: boolean;
    isPlacable: boolean;
    pos: Vec2;

    constructor(
        idProvider:IdProvider,
        pos:Vec2
        ) {
        super(idProvider);
        this.pos = pos;
        this.isAlive = true;
        this.isExiled = false;
        this.isActive = true;
        this.isPlacable = false;
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
        pawn.isPlacable = this.isPlacable;
        return pawn;
    }

    isPlayable(): boolean {
        return this.isActive && this.isAlive && !this.isExiled;
    }

    getStaticClassName(): string {
        return ObjectsNames.PAWN;
    }

    editSafe(gameState: GameState, owner: Player, fn: (newGs: GameState, newOw: Player, newPa: Pawn) => ModifierConclusion): ModifierConclusion {
        const newGs: GameState = gameState.copy();
        const newOw: Player = owner.copy();
        const newPa: Pawn = this.copy();
        
        const ccl: ModifierConclusion = fn(newGs, newOw, newPa);
        if (!ccl.success) return ccl;
        
        //console.log(gameState);
        newOw.replacePawnWith(newPa);
        var s = newGs.replacePlayerWith(newOw);
        ccl.effects.push({ name: ModEffNames.INTERNALREFCHANGE, old: gameState, new: newGs });
        ccl.effects.push({ name:ModEffNames.INTERNALREFCHANGE, old: owner, new: newOw });
        
        return ccl;
    }
}