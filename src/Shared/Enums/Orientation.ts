import { Pattern } from "../Types/Pattern";
import { Vec2 } from "../Types/Vec2";

export enum Orientation {
    NORTH = 0,
    EAST = 1,
    SOUTH = 2,
    WEST = 3,
}

export function getVec(or: Orientation): Vec2 {
    switch (or) {
        case Orientation.NORTH: return { x: 0, y: 1 };
        case Orientation.EAST: return { x: 1, y: 0 };
        case Orientation.SOUTH: return { x: 0, y: -1 };
        case Orientation.WEST: return { x: -1, y: 0 };
    }
}

export function reOrient(path:Pattern, orientation:Orientation): Orientation[] {
    const ret: Orientation[] = [];
    for(var step of path) {
        ret.push((orientation + step) % 4);
    }
    return ret;
}