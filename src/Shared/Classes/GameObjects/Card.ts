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
import { Orientation } from "../../Enums/Orientation";
import { DisplacementCardType } from "../CardTypes/DisplacementCardType";

export class Card extends GameObject {

    shown: boolean;
    playedGame: number;
    playedTurn: number;
    rotation: Orientation;

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
        if (this.type instanceof DisplacementCardType) {
            this.rotation = this.type.data.defaultRotation;
        } else {
            this.rotation = Orientation.NORTH;
        }
    }

    canRotate(): boolean {
        if(!(this.type instanceof DisplacementCardType))return false;
        return this.type.data.fullCircle;
    }

    rotate() {
        
    }

    pictureRotation() {
        if (this.type instanceof DisplacementCardType && !this.type.data.fullCircle) {
            return this.rotation - this.type.data.defaultRotation;
        }
        return this.rotation;
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
        if (!player.owns(this)) return getFailedConclusion("player does not own this card");
        if (this.playedGame >= this.type.data.maxGame) return getFailedConclusion("this card has been played too many times this game");
        if (this.playedTurn >= this.type.data.maxTurn) return getFailedConclusion("this card has been played too many times this turn");
        
        const ccl = this.type.play(gameState, actionIndex, player, objects);
        if (!ccl.success) return getFailedConclusion(ccl.reason ? ccl.reason : "unknown");

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
        if (newCard.type.data.maxGame < newCard.playedGame) return getFailedConclusion("AFTERHAND: this card has been played too many times this game");
        ccl.effects.push({ name: ModEffNames.CARDPGCHANGE, old: this, new: newCard });
        
        newCard.playedTurn += 1;
        if (newCard.type.data.maxTurn < newCard.playedTurn) return getFailedConclusion("AFTERHAND: this card has been played too many times this turn");
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