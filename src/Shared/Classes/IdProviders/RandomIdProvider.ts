import { IdProvider } from "../../Interfaces/IdProvider";

export class RandomIdProvider implements IdProvider{
    readonly provided = new Set<number>();
    
    constructor(readonly length: number) { }

    provide() {
        const max = Math.pow(10, Math.abs(this.length));
        const min = 1;
        var id: number;
        
        do {
            id = Math.floor((Math.random() * (max - min + 1)) + min) - 1;
        } while (this.provided.has(id));
        
        this.provided.add(id);
        return id;
    }
}