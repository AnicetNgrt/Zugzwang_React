import { Card } from "../GameObjects/Card";
import { CardType } from "../../Interfaces/CardType";
import { IdProvider } from "../../Interfaces/IdProvider";
import { Hand } from "./Hand";

export enum HandBuilderErrors {
    NONE = "Everything is fine",
    TOO_HEAVY = "Your hand is too heavy.",
    DUPLICATE_CARD = "You have the same card twice."
}

export class HandBuilder {
    private weight: number = 0;

    constructor(
        readonly cardTypes:CardType[], 
        readonly maxWeight:number,
        readonly validCompoCheck:() => HandBuilderErrors
        ) { }

    static getEmptyHandBuilder(
        maxWeight:number,
        validCompoCheck:() => HandBuilderErrors
    ) {
        return new HandBuilder([], maxWeight, validCompoCheck);
    }

    addCard(cardType:CardType) {
        this.weight += cardType.data.weight;
        this.cardTypes.push(cardType);
    }

    hasValidWeight(): boolean {
        return this.weight <= this.maxWeight && (new Set(this.cardTypes)).size !== this.cardTypes.length;
    }

    getHand(idProvider:IdProvider): Hand {
        if(!this.hasValidWeight) throw new Error(HandBuilderErrors.TOO_HEAVY);
        const endReason = this.validCompoCheck();
        if(endReason != HandBuilderErrors.NONE) throw new Error(endReason);
        var cards: Card[] = [];
        for(var type of this.cardTypes) {
            cards.push(Card.getCardOfType(type, idProvider));
        }
        return Hand.getHandFromCards(cards);
    }
}