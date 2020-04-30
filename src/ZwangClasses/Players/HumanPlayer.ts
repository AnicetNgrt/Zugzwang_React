import { SenderPlayer } from "../../ZwangInterfaces/SenderPlayer";
import { Hand } from "../Hand"
import { Pawn } from "../GameObjects/Pawn";
import { Card } from "../GameObjects/Card";

export type CardChosenFunc = (card:Card)=>void;
export type PawnChosenFunc = (pawn:Pawn)=>void;

export class HumanPlayer implements SenderPlayer {

    readonly cardChosenFuncs: CardChosenFunc[] = [];
    readonly pawnChosenFuncs: PawnChosenFunc[] = [];

    constructor(
        readonly hand: Hand,
        readonly pawns: [Pawn]
        ) { }

    sendMove(move: any): void {
        throw new Error("Method not implemented.");
    }
    
    hasLost(): Boolean {
        throw new Error("Method not implemented.");
    }
    
    play(gameState: import("../GameState").GameState): Promise<any> {
        return new Promise(async (resolve, reject) => {
            
        })
    }

    chooseCard(): Promise<Card> {
        return new Promise(async (resolve, reject) => {

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