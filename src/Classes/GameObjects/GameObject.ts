import { IdProvider } from "../../Interfaces/IdProvider";
import { CopyIdProvider } from "../IdProviders/CopyIdProvider";

export class GameObject {
    readonly id:number;

    constructor(
        readonly idProvider:IdProvider
        ) {
        this.id = idProvider.provide();
    }

    copy():GameObject {
        return new GameObject(CopyIdProvider.getYours(this));
    }
}