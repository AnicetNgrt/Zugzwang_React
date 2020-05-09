import { GameObject } from "./GameObject";
import { Vec2 } from "../../Types/Vec2";
import { IdProvider } from "../../Interfaces/IdProvider";
import { CopyIdProvider } from "../IdProviders/CopyIdProvider";

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
        const shiftMapCopy: Array<Array<Vec2>> = [];
        this.shiftMap.forEach(row => shiftMapCopy.push(Object.assign([], row)));
        return new Board(
            this.maxCrd,
            slipperyCopy,
            obstructedCopy,
            shiftMapCopy,
            CopyIdProvider.getYours(this)
        )
    }

    isIn(pos: Vec2): boolean {
        return (pos.x >= 0 && pos.y >= 0 && pos.x <= this.maxCrd.x && pos.y <= this.maxCrd.y);
    }

    getSlippery(pos: Vec2): Vec2 | null {
        if (!this.slippery.has(pos)) return null;
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
}