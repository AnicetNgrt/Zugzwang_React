import { CardType } from "../../ZwangInterfaces/CardType";
import { GameObject } from "./GameObject";
import { IdProvider } from "../../ZwangInterfaces/IdProvider";

export class Card extends GameObject {
    constructor(
        readonly type: CardType,
        readonly playedGame: number,
        readonly playedTurn: number,
        readonly idProvider: IdProvider
    ) {
        super(idProvider);
    }

    public static getCardOfType(cardType:CardType, idProvider:IdProvider): Card {
        return new Card(cardType, 0, 0, idProvider);
    }
}