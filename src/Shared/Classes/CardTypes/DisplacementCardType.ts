import { ShownCardType } from "./ShownCardType";
import { Action } from "../Other/Action";
import { CardTypeData } from "../../Interfaces/CardType";
import { Pattern } from "../../Types/Pattern";
import { Orientation, reOrient } from "../../Enums/Orientation";
import { Displacement } from "../../Types/Displacement";
import { getFromPatterns } from "../../Consts/Modifiers";

export interface DisplacementCardTypeData {
    readonly weight: number,
    readonly name: string,
    readonly picturePath: string | undefined,
    readonly maxTurn: number,
    readonly maxGame: number,
    readonly fullCircle: boolean,
    readonly displacements: Displacement[],
    readonly defaultRotation: Orientation;
}

export class DisplacementCardType extends ShownCardType {

    readonly data: CardTypeData & DisplacementCardTypeData;

    constructor(data:DisplacementCardTypeData, reo?:boolean) {
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
            var patterns:Pattern[] = [];
            if (data.fullCircle) {
                for (var p of disp.patterns) {
                    patterns.push(reOrient(p, Orientation.NORTH));
                    patterns.push(reOrient(p, Orientation.EAST));
                    patterns.push(reOrient(p, Orientation.SOUTH));
                    patterns.push(reOrient(p, Orientation.WEST));
                }
            } else if (reo === true || reo === undefined) {
                //console.log("zahdohdazoh  "+reo);
                for (p of disp.patterns) {
                    patterns.push(reOrient(p, data.defaultRotation));
                }
            } else {
                patterns = disp.patterns;
            }
            //console.log(patterns);
            actions.push(new Action(disp.cost, "moveActionTitle", "moveActionDesc", getFromPatterns(patterns)));
        }

        this.data = {
            ...data,
            actions: actions
        }
    }

    copy() {
        const disps = [];
        for (var d of this.data.displacements) {
            const patts = [];
            for (var pat of d.patterns) {
                patts.push(pat);
            }
            disps.push({ cost: d.cost, patterns: patts });
        }
        //console.log(this);
        //console.log(disps);

        return new DisplacementCardType({
            weight:this.data.weight,
            name:this.data.name,
            picturePath:this.data.picturePath,
            maxTurn:this.data.maxTurn,
            maxGame: this.data.maxGame,
            fullCircle: this.data.fullCircle,
            displacements: disps,
            defaultRotation: this.data.defaultRotation
        }, false);
    }   

    rotate(rotation:Orientation): boolean {
        if (this.data.fullCircle) return false;
        console.log(JSON.stringify(this.data.displacements));
        for(var i:number = 0; i < this.data.displacements.length; i++) {
            const torotate: Pattern[] = this.data.displacements[i].patterns;
            const rotatedPatterns: Pattern[] = [];
            for (var pattern of torotate) {
                const rotated = reOrient(pattern, rotation);
                rotatedPatterns.push(rotated);
            }
            this.data.displacements[i].patterns = rotatedPatterns;
            console.log(JSON.stringify(rotatedPatterns));
            console.log(JSON.stringify(this.data.displacements));
        }
        for (i = 0; i < this.data.displacements.length; i++) {
            var displacement = this.data.displacements[i];
            var action = this.data.actions[i];
            this.data.actions.splice(i, 1, new Action(action.cost, "moveActionTitle", "moveActionDesc", getFromPatterns(displacement.patterns)));
        }
        
        return true;
    }
}