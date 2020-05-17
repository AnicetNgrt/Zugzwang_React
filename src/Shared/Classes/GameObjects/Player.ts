import { Pawn } from "./Pawn";
import { IdProvider } from "../../Interfaces/IdProvider";
import { GameObject } from "./GameObject";
import { Card } from "./Card";
import { Rules } from "../../Types/Rules";
import { Vec2 } from "../../Types/Vec2";
import { ObjectsNames } from "./ObjectsNames";
import { CopyIdProvider } from "../IdProviders/CopyIdProvider";
import Pset from "../Other/Pset";

export type DeckChecker = (cards: Pset) => boolean;

export class Player extends GameObject {

    isFocused: boolean = false;
    hand: Pset = new Pset();
    pawns: Pset = new Pset();
    prohibitedTiles: Set<Vec2> = new Set();
    ap: number;
    name: string;
    color: string;
    playing: boolean;
    turnCount: number = 0;

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
        for (var pawn of Array.from(this.pawns.values())) {
            alive = (pawn as Pawn).isAlive;
        }
        return alive;
    }

    givePawn(pawn:Pawn) {
        this.pawns.add(pawn);
    }
    giveCard(card: Card) {
        this.hand.add(card);
    }
    remove(id: number) {
        this.pawns.deleteFromKey(id.toString());
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
        const handCopy = new Pset();
        for (var c of Array.from(this.hand.values())) {
            if (!(c instanceof Card)) continue;
            types.add(c.type.data.name);
            handCopy.add(c);
            weight += c.type.data.weight;
        }
        if (types.has(card.type.data.name)) return false;
        if (weight + card.type.data.weight > this.rules.maxWeight) return false;
        handCopy.add(card);
        if (!this.deckChecker(handCopy)) return false;
        return true;
    }

    getHandWeight(): number {
        var weight = 0;
        for (var card of Array.from(this.hand.values())) {
            if (!(card instanceof Card)) continue;
            weight += card.type.data.weight; 
        }
        return weight;
    }

    owns(object: GameObject): boolean {
        if (object instanceof Pawn) return this.pawns.has(object);
        if (object instanceof Card) return this.hand.has(object);
        return false;
    }

    copy(): Player {
        const p: Player = new Player(
            this.deckChecker,
            this.name,
            this.color,
            this.team,
            this.rules,
            CopyIdProvider.getYours(this),
            this.ap,
            this.playing
        );
        p.turnCount = this.turnCount;
        p.isFocused = this.isFocused;
        p.hand = new Pset();
        for (var ca of Array.from(this.hand.values())) {
            p.hand.add(ca);
        }
        p.pawns = new Pset();
        for (var pa of Array.from(this.pawns.values())) {
            p.pawns.add(pa);
        }
        p.prohibitedTiles = new Set();
        for (var tile of Array.from(this.prohibitedTiles.values())) {
            p.prohibitedTiles.add(tile);
        }
        return p;
    }

    getStaticClassName(): string {
        return ObjectsNames.PLAYER;
    }

    replacePawnWith(young: Pawn): boolean {
        if (this.pawns.has(young)) {
            this.pawns.add(young);
            return true;
        }
        return false;
    }

    replaceCardWith(young: Card): boolean {
        if (this.hand.has(young)) {
            this.hand.add(young);
            return true;
        }
        return false;
    }

    /*static getSafeCopy(gameState: GameState, player:Player): { gameState: GameState, player: Player } {
        const newGs = gameState.copy();
        const newPl = player.copy();

    }*/
}

