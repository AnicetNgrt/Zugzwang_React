import { GameObject } from "../GameObjects/GameObject";
import { Modification } from "./Modification";

export class Modifier {
    constructor(
        readonly combination: GameObject[],
        readonly impacts: Modification[]
    ) {
        
    }
}