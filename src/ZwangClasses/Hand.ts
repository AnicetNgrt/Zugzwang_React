import { Card } from "./GameObjects/Card";
import { CardType } from "../ZwangInterfaces/CardType";
import { IdProvider } from "../ZwangInterfaces/IdProvider";

export enum HandErrors {
    NONE = "Everything is fine",
    TOO_HEAVY = "Your hand is too heavy.",
    DUPLICATE_CARD = "You have the same card twice."
}

export class Hand {
    private weight: number = 0;

    constructor(
        readonly cardTypes:CardType[], 
        readonly maxWeight:number,
        readonly validCompoCheck:() => HandErrors
        ) { }

    static getEmptyHand(
        maxWeight:number,
        validCompoCheck:() => HandErrors
    ) {
        return new Hand([], maxWeight, validCompoCheck);
    }

    addCard(cardType:CardType) {
        this.weight += cardType.weight;
        this.cardTypes.push(cardType);
    }

    hasValidWeight(): boolean {
        return this.weight <= this.maxWeight && (new Set(this.cardTypes)).size !== this.cardTypes.length;
    }

    getCards(idProvider:IdProvider): Card[] {
        if(!this.hasValidWeight) throw new Error(HandErrors.TOO_HEAVY);
        const endReason = this.validCompoCheck();
        if(endReason != HandErrors.NONE) throw new Error(endReason);
        var cards: Card[] = [];
        for(var type of this.cardTypes) {
            cards.push(Card.getCardOfType(type, idProvider));
        }
        return cards;
    }
}