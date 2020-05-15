import { Player } from "./Player";
import { GameObject } from "./GameObject";
import { IdProvider } from "../../Interfaces/IdProvider";
import { CopyIdProvider } from "../IdProviders/CopyIdProvider";
import { ObjectsNames } from "./ObjectsNames";
import { Rules } from "../../Types/Rules";
import { Board } from "./Board";
import { Pawn } from "./Pawn";

export class GameState extends GameObject {

    board: Board;
    currentPlayerIndex: number

    constructor(
        readonly players: Player[],
        readonly idProvider: IdProvider,
        board: Board,
        readonly rules: Rules,
        currentPlayerIndex: number
    ) {
        super(idProvider);
        this.board = board;
        this.currentPlayerIndex = currentPlayerIndex;
    }
    
    copy(): GameState {
        return new GameState(this.players, CopyIdProvider.getYours(this), this.board, this.rules, this.currentPlayerIndex);
    }

    getStaticClassName(): string {
        return ObjectsNames.GAMESTATE;
    }

    replacePlayerWith(young: Player): boolean {
        for (var p of this.players) {
            if (p.id === young.id) {
                var i = this.players.indexOf(p);
                this.players[i] = young;
                return true;
            }
        }
        return false;
    }

    nextTurnState(): GameState {
        const newGs = this.copy();
        for (var player of this.players) {
            const newPlayer = player.copy();
            for (var card of Array.from(newPlayer.hand.values())) {
                const newCard = card.copy();
                newCard.playedTurn = 0;
                newPlayer.replaceCardWith(card);
            }
            newPlayer.ap = this.rules.maxAp;
            this.replacePlayerWith(newPlayer);
        }
        newGs.currentPlayerIndex = (newGs.currentPlayerIndex + 1) % newGs.players.length;
        return newGs;
    }

    findOwner(pawn: Pawn): Player | null {
        for (var p of this.players) {
            if (p.owns(pawn)) return p;
        }
        return null;
    }
}