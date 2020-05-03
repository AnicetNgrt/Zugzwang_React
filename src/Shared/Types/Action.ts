import { Player } from "../Classes/GameObjects/Player";
import { ModifierGenerator } from "./ModifierGenerator";

export type Action = {
    name:string;
    cost:number;
    modifierGenerator:ModifierGenerator;
}