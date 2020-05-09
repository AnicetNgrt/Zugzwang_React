import { Pawn } from "./Pawn";
import { IdProvider } from "../../Interfaces/IdProvider";
import { GameObject } from "./GameObject";
import { CardType } from "../../Interfaces/CardType";
import { Card } from "./Card";
import { Rules } from "../../Types/Rules";
import { Vec2 } from "../../Types/Vec2";
import { Board } from "./Board";

export type DeckChecker = (cards: Card[]) => boolean;

export class Player extends GameObject {
    readonly isFocused: boolean = false;
    readonly hand: Set<Card> = new Set();
    readonly pawns: Set<Pawn> = new Set();
    ap: number;

    constructor(
        readonly deckChecker: DeckChecker,
        readonly team: number,
        readonly rules: Rules,
        readonly idProvider: IdProvider,
        ap: number
    ) {
        super(idProvider);
        this.ap = ap;
    }
    
    hasLost(): Boolean {
        var alive = false;
        this.pawns.forEach((pawn: Pawn) => {
            alive = pawn.isAlive;
        });
        return alive;
    }

    addPawn(pos: Vec2, board:Board): boolean {
        if (!board.isIn(pos)) return false;
        this.pawns.add(new Pawn(this.idProvider, pos));
        return true;
    }

    addCard(card:Card): boolean {
        var types = new Set<CardType>();
        var weight = 0;
        this.hand.forEach((c: Card) => {
            types.add(c.type);
            weight++;
        })
        if (types.has(card.type)) return false;
        if (weight + card.type.data.weight > this.rules.maxWeight) return false;
        this.hand.add(card);
        return true;
    }

    owns(object: GameObject): boolean {
        var id = object.id;
        for (var pawn of Array.from(this.pawns.values())) {
            if (pawn.id === id) return true;
        }
        for (var card of Array.from(this.hand.values())) {
            if (card.id === id) return true;
        }
        return false;
    }
}

