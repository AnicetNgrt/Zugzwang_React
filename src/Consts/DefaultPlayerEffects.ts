import { PlayerEffect } from "../Classes/GameObjects/PlayerEffect";
import { IdProvider } from "../Interfaces/IdProvider";

export function DefaultPlayerEffects(idProvider:IdProvider):{[key:string]:PlayerEffect} {
    return {
        focus: new PlayerEffect("Focus", "", null, 1, 0, idProvider),
        explorer: new PlayerEffect("Explorer", "", null, 1, 0, idProvider),
        actionPoints: new PlayerEffect("Action points", "", null, 999, 0, idProvider),
        reinforcements: new PlayerEffect("Reinforcements", "", null, 999, 999, idProvider)
    }
}