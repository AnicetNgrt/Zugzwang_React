import { IdProvider } from "../../ZwangInterfaces/IdProvider";

export class RandomIdProvider {
    constructor(readonly length: number) {}

    provide() {
        const max = Math.pow(10, Math.abs(this.length));
        const min = 1;
        return Math.floor((Math.random() * (max - min + 1)) + min) - 1;
    }
}

export class GameObject {
    readonly id:number;

    constructor(idProvider:IdProvider) {
        this.id = idProvider.provide();
    }
}