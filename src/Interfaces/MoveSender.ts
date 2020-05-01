import { Move } from "../Classes/Other/Move";

export interface MoveSender {
    sendMove(move:Move):void;
}