import { ShownCardType } from "./ShownCardType";
import { Player } from "../../ZwangInterfaces/Player";
import { Action } from "../../ZwangInterfaces/Action";
import { GameState } from "../GameState";

export enum Orientation {
    NORTH = 0,
    EAST = 1,
    SOUTH = 2,
    WEST = 3,
}

export function reOrient(path:Orientation[], orientation:Orientation): Orientation[] {
    const ret: Orientation[] = [];
    for(var step of path) {
        ret.push((orientation + step) % 4);
    }
    return ret;
}

export class DisplacementCardType extends ShownCardType {
    
    getPlayableFor(player:Player, gameState:GameState): Action[] {
        const ret: Action[] = [];
        return ret.concat(super.getPlayableFor(player, gameState));
    }   

    static getDefault(): DisplacementCardType {
        return (ShownCardType.getDefault() as DisplacementCardType);
    }
}