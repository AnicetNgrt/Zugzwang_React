import { GameObject } from "../GameObjects/GameObject";
import { Modification } from "./Modification";

export class Modifier {
    constructor(
        readonly combinations: {[index:number]:[GameObject]},
        readonly impacts: Modification[]
    ) {
        
    }
}