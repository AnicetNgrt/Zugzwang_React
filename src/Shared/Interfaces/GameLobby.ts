import { GameState } from "../Classes/Other/GameState";
import { GamePhase } from "../Enums/GamePhase";

export interface GameLobby {
    readonly phases: Set<GamePhase>;
    readonly clock:number;
    readonly gameStates:GameState[];
    readonly winner:string;
    readonly players:[ string ];
}