import { IdProvider } from "../../Interfaces/IdProvider";

export class RandomIdProvider implements IdProvider{
    constructor(readonly length: number) {}

    provide() {
        const max = Math.pow(10, Math.abs(this.length));
        const min = 1;
        return Math.floor((Math.random() * (max - min + 1)) + min) - 1;
    }
}