import { Pattern } from "../Types/Pattern";

export enum Orientation {
    NORTH = 0,
    EAST = 1,
    SOUTH = 2,
    WEST = 3,
}

export function reOrient(path:Pattern, orientation:Orientation): Orientation[] {
    const ret: Orientation[] = [];
    for(var step of path) {
        ret.push((orientation + step) % 4);
    }
    return ret;
}