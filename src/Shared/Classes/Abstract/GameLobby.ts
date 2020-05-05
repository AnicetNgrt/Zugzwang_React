import { GameState } from "../Other/GameState";
import { GamePhase } from "../../Enums/GamePhase";

export abstract class GameLobby {
  
    readonly gameStates: GameState[] = [];
    readonly clock: number = 0;
    readonly winner: string | null = null;
    readonly phases: Set<GamePhase> = new Set();
  
    constructor(
      readonly players: [string]
    ) { 
      this.phases.add(GamePhase.PLAYER_GATHERING);
    }
  }