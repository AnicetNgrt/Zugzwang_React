import { GameObject } from "./GameObject";
import { Vec2, add } from "../../Types/Vec2";
import { IdProvider } from "../../Interfaces/IdProvider";
import { CopyIdProvider } from "../IdProviders/CopyIdProvider";
import { ObjectsNames } from "./ObjectsNames";
import { Pawn } from "./Pawn";
import { Pattern } from "../../Types/Pattern";
import { getVec } from "../../Enums/Orientation";
import { Player } from "./Player";

export class Board extends GameObject {
    constructor(
        readonly maxCrd: Vec2,
        readonly slippery: Set<Vec2>,
        readonly obstructed: Set<Vec2>,
        readonly shiftMap: Array<Array<Vec2>>,
        idProvider:IdProvider
    ) {
        super(idProvider);
    }

    copy():Board {
        const slipperyCopy = new Set(this.slippery);
        const obstructedCopy = new Set(this.obstructed);
        return new Board(
            this.maxCrd,
            slipperyCopy,
            obstructedCopy,
            this.shiftMap,
            CopyIdProvider.getYours(this)
        )
    }

    isIn(pos: Vec2): boolean {
        return (pos.x >= 0 && pos.y >= 0 && pos.x <= this.maxCrd.x && pos.y <= this.maxCrd.y);
    }

    getSlippery(pos: Vec2): Vec2 {
        if (!this.slippery.has(pos)) return {x:0, y:0};
        return this.shiftMap[pos.y][pos.x];
    }

    isObstructed(pos: Vec2): boolean {
        return this.obstructed.has(pos);
    }

    static getFromSize(size:Vec2, idProvider:IdProvider):Board {
        const shiftMap: Array<Array<Vec2>> = [];
        var mys: number[] = [];
        var mxs: number[] = [];

        if (size.y % 2 === 0) {
            mys.push(size.y / 2);
            mys.push((size.y / 2) - 1);
        } else {
            mys.push((size.y - 1) / 2);
        }
        if (size.x % 2 === 0) {
            mxs.push(size.x / 2);
            mxs.push((size.x / 2) - 1);
        } else {
            mxs.push((size.x - 1) / 2);
        }

        var middles:Vec2[] = [];

        mxs = mxs.sort();
        mys = mys.sort();

        // [higher left, higher right,
        //  lower left,  lower right]

        for (var y of mys) {// haut en bas
            for (var x of mxs) {// gauche à droite
                middles.push({x:x, y:y});
            }
        }

        for (y = 0; y < size.y; y++) {
            shiftMap.push([]);
            for (x = 0; x < size.x; x++) {
                var vec1:Vec2;
                var vec2:Vec2;

                if (y > middles[0].y) {
                    vec1 = {x:0, y:1};
                } else if (y < middles[(middles.length - 1)].y) {
                    vec1 = {x:0, y:-1};
                } else {
                    vec1 = {x:0, y:0};
                }

                if (x > middles[(middles.length - 1)].x) {
					vec2 = {x:-1, y:0};
				} else if (x < middles[0].x) {
					vec2 = {x:1, y:0};
				} else {
                    vec2 = {x:0, y:0};
                }

                shiftMap[y].push({x:vec1.x+vec2.x, y:vec1.y+vec2.y});
            }
        }

        return new Board({x:size.x-1, y:size.y-1}, new Set(),  new Set(), shiftMap, idProvider);
    }

    movePawnFromPattern(pawn: Pawn, owner: Player, pattern: Pattern): boolean {
        const oldPos: Vec2 = pawn.pos; 
        var newPos: Vec2 = { x: oldPos.x, y: oldPos.y };
        for (var or of pattern) {
            const vec: Vec2 = getVec(or);
            newPos = add(newPos, vec);
        }
        return this.movePawn(pawn, owner, newPos);
    }

    movePawn(pawn: Pawn, owner: Player, newPos: Vec2): boolean {
        console.log("pos: " + JSON.stringify(newPos));
        newPos = { x: newPos.x % (this.maxCrd.x + 1), y: newPos.y % (this.maxCrd.y + 1) };
        console.log("adjustedPos: " + JSON.stringify(newPos));
        if (owner.prohibitedTiles.has(newPos)) return false;

        if (this.isObstructed(newPos)) return false;

        const shiftedPos: Vec2 = add(newPos, this.getSlippery(newPos));
        console.log("shiftedPos: " + JSON.stringify(newPos));
        if (shiftedPos.x === newPos.x && shiftedPos.y === newPos.y) {
            pawn.pos = { x: newPos.x, y: newPos.y };
            return true;
        }
        return this.movePawn(pawn, owner, shiftedPos);
    }

    getStaticClassName(): string {
        return ObjectsNames.BOARD;
    }
}