import { Pawn } from "./Pawn";
import { IdProvider } from "../../Interfaces/IdProvider";
import { GameObject } from "./GameObject";
import { CardType } from "../../Interfaces/CardType";
import { Card } from "./Card";
import { Rules } from "../../Types/Rules";
import { Vec2 } from "../../Types/Vec2";
import { Board } from "./Board";
import { ObjectsNames } from "./ObjectsNames";

export type DeckChecker = (cards: Set<Card>) => boolean;

export class Player extends GameObject {

    isFocused: boolean = false;
    hand: Set<Card> = new Set();
    pawns: Set<Pawn> = new Set();
    prohibitedTiles: Set<Vec2> = new Set();
    ap: number;

    constructor(
        readonly deckChecker: DeckChecker,
        readonly name: string,
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
        const handCopy = new Set(this.hand);
        handCopy.add(card);
        if (!this.deckChecker(handCopy)) return false;
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

    copy(): Player {
        const p: Player = new Player(
            this.deckChecker,
            this.name,
            this.team,
            this.rules,
            this.idProvider,
            this.ap
        );
        p.isFocused = this.isFocused;
        p.hand = new Set(this.hand);
        p.pawns = new Set(this.pawns);
        p.prohibitedTiles = new Set(this.prohibitedTiles);
        return p;
    }

    getStaticClassName(): string {
        return ObjectsNames.PLAYER;
    }

    replacePawnWith(young: Pawn): boolean {
        for (var pa of Array.from(this.pawns.values())) {
            if (pa.id === young.id) {
                this.pawns.delete(pa);
                this.pawns.add(young);
                return true;
            }
        }
        return false;
    }

    replaceCardWith(young: Card): boolean {
        for (var ca of Array.from(this.hand.values())) {
            if (ca.id === young.id) {
                this.hand.delete(ca);
                this.hand.add(young);
                return true;
            }
        }
        return false;
    }

    /*static getSafeCopy(gameState: GameState, player:Player): { gameState: GameState, player: Player } {
        const newGs = gameState.copy();
        const newPl = player.copy();

    }*/
}

