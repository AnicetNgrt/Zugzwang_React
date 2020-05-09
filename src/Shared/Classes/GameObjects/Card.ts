import { CardType } from "../../Interfaces/CardType";
import { GameObject } from "./GameObject";
import { IdProvider } from "../../Interfaces/IdProvider";
import { Action } from "../Other/Action";
import { GameState } from "../Other/GameState";
import { Player } from "./Player";
import { CopyIdProvider } from "../IdProviders/CopyIdProvider";

export class Card extends GameObject {

    shown: boolean;

    constructor(
        readonly type: CardType,
        readonly playedGame: number,
        readonly playedTurn: number,
        readonly idProvider: IdProvider,
        readonly actions: Action[],
        shown:boolean
    ) {
        super(idProvider);
        this.shown = shown;
    }

    copy():Card {
        const copy = new Card(
            this.type, 
            this.playedGame, 
            this.playedTurn,
            CopyIdProvider.getYours(this),
            [...this.actions],
            this.shown)
        return copy;
    }

    canBePlayed(gameState: GameState, player: Player) {
        if (!player.owns(this)) return false;
        if (this.playedGame >= this.type.data.maxGame) return false;
        if (this.playedTurn >= this.type.data.maxTurn) return false;
        return true;
    }
}