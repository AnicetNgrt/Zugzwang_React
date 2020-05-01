import { Player } from "../GameObjects/Player";
import { Modifier } from "./Modifier";
import { Card } from "../GameObjects/Card";

export class Move {
    constructor(
        readonly player:Player,
        readonly card:Card,
        readonly modifier:Modifier
        ) {
    }
}