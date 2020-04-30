import { Player } from "./Player";
import { Move } from "../Classes/Move";

export interface SenderPlayer extends Player {
    sendMove(move:Move):void;
}