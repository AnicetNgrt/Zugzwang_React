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

    static getFromSize(size:Vec2, idProvider:IdProvider):Board {
        const shiftMap: Vec2[][] = [];
        var mys: number[] = [];
        var mxs: number[] = [];

        if (size.y % 2 == 0) {
            mys.push(size.y / 2);
            mys.push((size.y / 2) - 1);
        } else {
            mys.push((size.y - 1) / 2);
        }
        if (size.x % 2 == 0) {
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

        for (var y = 0; y < size.y; y++) {
            shiftMap.push([]);
            for (var x = 0; x < size.x; x++) {
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

        return new Board({x:size.x-1, y:size.y-1}, [], [], shiftMap, idProvider);
    }
}