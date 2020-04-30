import { CardType } from "../../ZwangInterfaces/CardType";
import { GameObject } from "./GameObject";
import { IdProvider } from "../../ZwangInterfaces/IdProvider";
import { Action } from "../../ZwangInterfaces/Action";
import { GameState } from "../GameState";
import { Player } from "../../ZwangInterfaces/Player";

export class Card extends GameObject {
    constructor(
        readonly type: CardType,
        readonly playedGame: number,
        readonly playedTurn: number,
        readonly idProvider: IdProvider
    ) {
        super(idProvider);
    }

    getPlayableFor(player:Player, gameState:GameState): Action[] {
        return this.type.getPlayableFor(player, gameState);
    }

    public static getCardOfType(cardType:CardType, idProvider:IdProvider): Card {
        return new Card(cardType, 0, 0, idProvider);
    }
}