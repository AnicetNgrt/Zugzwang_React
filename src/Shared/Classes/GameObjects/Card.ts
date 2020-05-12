import { CardType } from "../../Interfaces/CardType";
import { GameObject } from "./GameObject";
import { IdProvider } from "../../Interfaces/IdProvider";
import { GameState } from "./GameState";
import { Player } from "./Player";
import { CopyIdProvider } from "../IdProviders/CopyIdProvider";
import { ObjectsNames } from "./ObjectsNames";
import { ModifierConclusion, getFailedConclusion, ModifierObjects } from "../Other/Modifier";
import { FlickeringCardType } from "../CardTypes/FlickeringCardType";
import { ModEffNames } from "../../Consts/Modifiers";

export class Card extends GameObject {

    shown: boolean;
    playedGame: number;
    playedTurn: number;

    constructor(
        readonly type: CardType,
        playedGame: number,
        playedTurn: number,
        readonly idProvider: IdProvider,
        shown:boolean
    ) {
        super(idProvider);
        this.shown = shown;
        this.playedGame = playedGame;
        this.playedTurn = playedTurn;
    }

    copy():Card {
        const copy = new Card(
            this.type, 
            this.playedGame, 
            this.playedTurn,
            CopyIdProvider.getYours(this),
            this.shown)
        return copy;
    }

    play(gameState: GameState, actionIndex:number, player: Player, objects: ModifierObjects): ModifierConclusion {
        if (!player.owns(this)) return getFailedConclusion();
        if (this.playedGame >= this.type.data.maxGame) return getFailedConclusion();
        if (this.playedTurn >= this.type.data.maxTurn) return getFailedConclusion();
        const ccl = this.type.play(gameState, actionIndex, player, objects);
        if (!ccl.success) return getFailedConclusion();

        var newGs: GameState | undefined = undefined;
        var newPlayer: Player | undefined = undefined;
        var newCard: Card | undefined = undefined;

        for (var effect of ccl.effects) {
            if (effect.new.id === this.id) {
                newCard = (effect.new as Card);
                break;
            }
        }
        if (newCard === undefined) newCard = this.copy();

        for (effect of ccl.effects) {
            if (effect.new.id === player.id) {
                newPlayer = (effect.new as Player);
                break;
            }
        }
        if (newPlayer === undefined) newPlayer = player.copy();
        newPlayer.replaceCardWith(newCard);
        ccl.effects.push({ name: ModEffNames.INTERNALREFCHANGE, old: player, new: newPlayer });

        for (effect of ccl.effects) {
            if (effect.new.id === gameState.id) {
                newGs = (effect.new as GameState);
                break;
            }
        }
        if (newGs === undefined) newGs = gameState.copy();
        newGs.replacePlayerWith(newPlayer);
        ccl.effects.push({ name: ModEffNames.INTERNALREFCHANGE, old: gameState, new: newGs });

        newCard.playedGame += 1;
        if (newCard.type.data.maxGame < newCard.playedGame) return getFailedConclusion();
        ccl.effects.push({ name: ModEffNames.CARDPGCHANGE, old: this, new: newCard });
        
        newCard.playedTurn += 1;
        if (newCard.type.data.maxTurn < newCard.playedTurn) return getFailedConclusion();
        ccl.effects.push({ name: ModEffNames.CARDPTCHANGE, old: this, new: newCard });
        if (newCard.type instanceof FlickeringCardType && !newCard.shown) {
            newCard.shown = true;
            ccl.effects.push({ name: ModEffNames.CARDREVEAL, old: this, new: newCard });
        }

        return ccl;
    }


    getStaticClassName(): string {
        return ObjectsNames.CARD;
    }
}