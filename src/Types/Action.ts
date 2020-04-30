import { Player } from "../Classes/Abstract/Player";
import { ModifierGenerator } from "./ModifierGenerator";

export type Action = {
    name:string;
    cost:number;
    modifierGenerator:ModifierGenerator;
}