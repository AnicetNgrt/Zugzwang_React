import { GameObject } from "./GameObjects/GameObject";
import { Modification } from "./Modification";

export class Modifier {
    constructor(
        readonly parameters: {[index:number]:[GameObject]},
        readonly impacted: {[index:number]:Modification}
        ) {

        }
}