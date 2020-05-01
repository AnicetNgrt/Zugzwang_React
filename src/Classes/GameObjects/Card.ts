import { CardType } from "../../Interfaces/CardType";
import { GameObject } from "./GameObject";
import { IdProvider } from "../../Interfaces/IdProvider";
import { Action } from "../../Types/Action";
import { GameState } from "../Other/GameState";
import { Player } from "./Player";
import { CopyIdProvider } from "../IdProviders/CopyIdProvider";
import { Hidable, isHidable } from "../../Interfaces/Hidable";
import { FlickeringCardType } from "../CardTypes/FlickeringCardType";

export class Card extends GameObject implements Hidable {

    private _shown: boolean;
    set shown(shown:boolean) {
        if(this.type instanceof FlickeringCardType) {
            this._shown = shown;
        }
    }
    get shown() {
        return this._shown;
    }

    constructor(
        readonly type: CardType,
        readonly playedGame: number,
        readonly playedTurn: number,
        readonly idProvider: IdProvider,
        shown?:boolean
    ) {
        super(idProvider);
        if(shown != undefined) {
            this._shown = shown;
        }else if(isHidable(type)) {
            this._shown = type.shown;
        } else {
            this._shown = true;
        }
    }

    getPlayableFor(player:Player, gameState:GameState): Action[] {
        return this.type.getPlayableFor(player, gameState);
    }

    copy():Card {
        const copy = new Card(
            this.type, 
            this.playedGame, 
            this.playedTurn,
            CopyIdProvider.getYours(this))
        return copy;
    }

    public static getCardOfType(cardType:CardType, idProvider:IdProvider): Card {
        return new Card(cardType, 0, 0, idProvider);
    }
}