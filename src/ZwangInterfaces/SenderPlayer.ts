import { Player } from "./Player";
import { Move } from "../ZwangClasses/Move";

export interface SenderPlayer extends Player {
    sendMove(move:Move):void;
}