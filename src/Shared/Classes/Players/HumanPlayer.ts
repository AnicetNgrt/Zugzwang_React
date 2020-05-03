import { Hand } from "../Other/Hand"
import { Pawn } from "../GameObjects/Pawn";
import { Card } from "../GameObjects/Card";
import { Player } from "../GameObjects/Player";
import { GameState } from "../Other/GameState";
import { IdProvider } from "../../Interfaces/IdProvider";

export type CardChosenFunc = (card:Card)=>void;
export type PawnChosenFunc = (pawn:Pawn)=>void;

export class HumanPlayer extends Player {

    readonly cardChosenFuncs: CardChosenFunc[] = [];
    readonly pawnChosenFuncs: PawnChosenFunc[] = [];

    constructor(
        readonly hand: Hand,
        readonly pawns: [Pawn],
        readonly team:number,
        idProvider:IdProvider
        ) {
            super(hand, pawns, team, idProvider);
         }

    hasLost(): Boolean {
        throw new Error("Method not implemented.");
    }
    
    play(gameState: GameState): Promise<any> {
        return new Promise(async (resolve, reject) => {
            
        })
    }

    chooseCard(): Promise<Card> {
        return new Promise(async (resolve, reject) => {
            this.onCardChosen((card:Card)=>{
                resolve(card);
            })
        })
    }

    choosePawn(): Promise<Pawn> {
        return new Promise(async (resolve, reject) => {

        })
    }
     
    onCardChosen(func:(card:Card)=>void) {
        this.cardChosenFuncs.push(func);
    }

    onPawnChosen(func:(pawn:Pawn)=>void) {
        this.pawnChosenFuncs.push(func);
    }

    cardChosen(card:Card) {
        for( var func of this.cardChosenFuncs ) {
            (func as CardChosenFunc)(card);
        }
    }

    pawnChosen(pawn:Pawn) {
        for( var func of this.pawnChosenFuncs ) {
            (func as PawnChosenFunc)(pawn);
        }
    }
}