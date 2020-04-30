import { Player } from "../Interfaces/Player";
import { Modifier } from "./Modifier";
import { Card } from "./GameObjects/Card";

export abstract class Move {
    constructor(
        readonly player:Player,
        readonly card:Card,
        readonly modifier:Modifier
        ) {
    }
}