import { IdProvider } from "../../Interfaces/IdProvider";
import { GameObject } from "../GameObjects/GameObject";

export class CopyIdProvider implements IdProvider{
    constructor(readonly id:number) {}

    provide() {
        return this.id;
    }

    static getYours(gameObject:GameObject) {
        return new CopyIdProvider(gameObject.id);
    }
}