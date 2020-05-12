import { ShownCardType } from "./ShownCardType";
import { Action } from "../Other/Action";
import { CardTypeData } from "../../Interfaces/CardType";
import { Pattern } from "../../Types/Pattern";
import { Orientation, reOrient } from "../../Enums/Orientation";
import { Displacement } from "../../Types/Displacement";
import { getFromPattern } from "../../Consts/Modifiers";

export interface DisplacementCardTypeData {
    readonly weight: number,
    readonly name: string,
    readonly picturePath: string | undefined,
    readonly maxTurn: number,
    readonly maxGame: number,
    readonly fullCircle: boolean,
    readonly displacements: Displacement[]
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

        const actions: Action[] = [];
        for (var disp of data.displacements) {
            actions.push(new Action(disp.cost, "moveActionTitle", "moveActionDesc", getFromPattern(disp.pattern)));
        }

        this.data = {
            ...data,
            actions: []
        }
    }

    rotate(rotation:Orientation) {
        if(this.data.fullCircle) return;
        for(var i:number = 0; i < this.data.displacements.length; i++) {
            const rotated:Pattern = reOrient(this.data.displacements[i].pattern, rotation);
            this.data.displacements[i].pattern = rotated;
        }
    }
}