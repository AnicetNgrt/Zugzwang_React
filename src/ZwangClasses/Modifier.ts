import { GameObject } from "./GameObjects/GameObject";

export class Modification {
    constructor(
        readonly before:GameObject,
        readonly after:GameObject
    ) {}
}

export class Modifier {
    constructor(
        readonly parameters: {[index:number]:[GameObject]},
        readonly impacted: {[index:number]:Modification}
        ) {

        }
}