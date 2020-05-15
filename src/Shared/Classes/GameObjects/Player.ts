import { Pawn } from "./Pawn";
import { IdProvider } from "../../Interfaces/IdProvider";
import { GameObject } from "./GameObject";
import { Card } from "./Card";
import { Rules } from "../../Types/Rules";
import { Vec2 } from "../../Types/Vec2";
import { ObjectsNames } from "./ObjectsNames";

export type DeckChecker = (cards: Set<Card>) => boolean;

export class Player extends GameObject {

    isFocused: boolean = false;
    hand: Set<Card> = new Set();
    pawns: Set<Pawn> = new Set();
    prohibitedTiles: Set<Vec2> = new Set();
    ap: number;
    name: string;
    color: string;
    playing: boolean;

    constructor(
        readonly deckChecker: DeckChecker,
        name: string,
        color: string,
        readonly team: number,
        readonly rules: Rules,
        readonly idProvider: IdProvider,
        ap: number,
        playing: boolean
    ) {
        super(idProvider);
        this.ap = ap;
        this.name = name;
        this.color = color;
        this.playing = playing;
    }
    
    hasLost(): Boolean {
        var alive = false;
        this.pawns.forEach((pawn: Pawn) => {
            alive = pawn.isAlive;
        });
        return alive;
    }

    givePawn(pawn:Pawn) {
        this.pawns.add(pawn);
    }

    addCard(card:Card): boolean {
        if (this.canAddCard(card)) {
            this.hand.add(card);
            return true;
        } else {
            return false;
        }
    }

    removeCard(card: Card) {
        this.hand.delete(card);
    }

    canAddCard(card:Card): boolean {
        var types = new Set<string>();
        var weight = 0;
        this.hand.forEach((c: Card) => {
            types.add(c.type.data.name);
            weight += c.type.data.weight;
        })
        if (types.has(card.type.data.name)) return false;
        if (weight + card.type.data.weight > this.rules.maxWeight) return false;
        const handCopy = new Set(this.hand);
        handCopy.add(card);
        if (!this.deckChecker(handCopy)) return false;
        return true;
    }

    getHandWeight(): number {
        var weight = 0;
        this.hand.forEach((c: Card) => {
            weight += c.type.data.weight;
        });
        return weight;
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
            this.color,
            this.team,
            this.rules,
            this.idProvider,
            this.ap,
            this.playing
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

