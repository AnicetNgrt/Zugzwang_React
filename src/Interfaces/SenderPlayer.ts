import { Player } from "../Classes/Abstract/Player";
import { Move } from "../Classes/Other/Move";

export interface SenderPlayer extends Player {
    sendMove(move:Move):void;
}