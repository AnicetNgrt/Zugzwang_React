import { IdProvider } from "../../Interfaces/IdProvider";
import { GameObject } from "./GameObject";

export class PlayerEffect extends GameObject {

    private _level:number = 0;
    set level(level:number) {
        this._level = Math.max(Math.min(level, this.maxLevel),0);
    }
    get level() {
        return this._level;
    }

    constructor(
        readonly name:string,
        readonly description:string,
        readonly picturePath:string|null,
        readonly maxLevel:number,
        level:number,
        idProvider:IdProvider
        ) {
            super(idProvider);
            this.level = level;
        }  
}