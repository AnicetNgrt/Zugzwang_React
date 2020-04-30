import { ShownCardType } from "../extendable/ShownCardType";
import { Player } from "../../../Interfaces/Player";
import { Action } from "../../../Interfaces/Action";
import { GameState } from "../../GameState";
import { CardTypeData } from "../../../Interfaces/CardType";

export enum Orientation {
    NORTH = 0,
    EAST = 1,
    SOUTH = 2,
    WEST = 3,
}

export type Pattern = Orientation[];

export function reOrient(path:Pattern, orientation:Orientation): Orientation[] {
    const ret: Orientation[] = [];
    for(var step of path) {
        ret.push((orientation + step) % 4);
    }
    return ret;
}

export interface DisplacementCardTypeData {
    readonly weight: number,
    readonly name: string,
    readonly picturePath: string | null,
    readonly maxTurn: number,
    readonly maxGame: number,
    readonly fullCircle: boolean,
    readonly patterns: Pattern[]
}

export class DisplacementCardType extends ShownCardType {

    readonly data: CardTypeData & DisplacementCardTypeData;

    constructor(data:DisplacementCardTypeData) {
        super({
            weight:data.weight,
            name:data.name,
            picturePath:data.picturePath,
            maxTurn:data.maxTurn,
            maxGame:data.maxGame,
            actions: []
        });
        this.data = {
            ...data,
            actions: []
        }
    }

    rotate(rotation:Orientation) {
        if(this.data.fullCircle) return;
        for(var i:number = 0; i < this.data.patterns.length; i++) {
            const pattern:Pattern = this.data.patterns[i];
            const rotated:Pattern = reOrient(pattern, rotation);
            this.data.patterns.splice(i, 1, rotated);
        }
    }

    getPlayableFor(player:Player, gameState:GameState): Action[] {
        const ret: Action[] = [];
        return ret.concat(super.getPlayableFor(player, gameState));
    }   
}