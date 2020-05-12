import { IdProvider } from "../../Interfaces/IdProvider";

export abstract class GameObject {
    readonly id:number;

    constructor(
        readonly idProvider:IdProvider
        ) {
        this.id = idProvider.provide();
    }

    abstract copy(): GameObject;
    abstract getStaticClassName(): string;
}