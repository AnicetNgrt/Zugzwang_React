import { CardType } from "../../Interfaces/CardType";
import { GameObject } from "./GameObject";
import { IdProvider } from "../../Interfaces/IdProvider";
import { Action } from "../../Types/Action";
import { GameState } from "../Other/GameState";
import { Player } from "../Abstract/Player";

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