import { Player } from "./Player";
import { GameObject } from "./GameObject";
import { IdProvider } from "../../Interfaces/IdProvider";
import { CopyIdProvider } from "../IdProviders/CopyIdProvider";
import { ObjectsNames } from "./ObjectsNames";
import { Rules } from "../../Types/Rules";
import { Board } from "./Board";
import { Pawn } from "./Pawn";
import { Card } from "./Card";
import { Vec2 } from "../../Types/Vec2";

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
        const players = [];
        for (var p of this.players) {
            players.push(p);
        }
        return new GameState(players, CopyIdProvider.getYours(this), this.board, this.rules, this.currentPlayerIndex);
    }

    findEquivalent(obj: GameObject): GameObject | null {
        var res: GameObject | Vec2 | undefined;
        if (obj instanceof Pawn) {
            for (var p of this.players) {
                res = p.pawns.get(obj.id.toString());
                if (res !== undefined) return (res as Pawn);
            }
        } else if (obj instanceof Player) {
            for (var p of this.players) {
                if (p.id === obj.id) return (p as Player);
            }
        } else if (obj instanceof Card) {
            for (var p of this.players) {
                res = p.hand.get(obj.id.toString());
                if (res !== undefined) return (res as Card);
            }
        } else if (obj instanceof Board) {
            if (this.board.id === obj.id) return (this.board as Board);
        }
        return null;
    }

    getStaticClassName(): string {
        return ObjectsNames.GAMESTATE;
    }

    replacePlayerWith(young: Player): boolean {
        /*console.log("YOUNG");
        console.log(young);
        console.log("OLDS");
        console.log(this.players);*/
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
                if (!(card instanceof Card)) continue;
                const newCard = card.copy();
                newCard.playedTurn = 0;
                newPlayer.replaceCardWith(newCard);
            }
            if(newPlayer.playing) newPlayer.turnCount++;
            if (newPlayer.turnCount >= 1) newPlayer.ap = this.rules.maxAp; 
            newPlayer.playing = !newPlayer.playing;
            newGs.replacePlayerWith(newPlayer);
        }
        //newGs.currentPlayerIndex = (newGs.currentPlayerIndex + 1) % newGs.players.length;
        return newGs;
    }

    findOwner(obj: GameObject): Player | null {
        for (var p of this.players) {
            if (obj instanceof Pawn) if (p.owns(obj as Pawn)) return p;
            if(obj instanceof Card) if (p.owns(obj as Card)) return p;
        }
        return null;
    }
}