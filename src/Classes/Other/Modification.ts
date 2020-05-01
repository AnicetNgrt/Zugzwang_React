import { GameObject } from "../GameObjects/GameObject";

export class Modification {
    constructor(
        readonly before:GameObject,
        readonly after:GameObject
    ) {
        
    }
}