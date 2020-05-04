import { GameLobby } from "../Shared/Interfaces/GameLobby";
import { GamePhase } from "../Shared/Enums/GamePhase";
import { GameState } from "../Shared/Classes/Other/GameState";

export class ServerSideGameLobby implements GameLobby {

  constructor(
    readonly phases: Set<GamePhase>,
    readonly clock: number,
    readonly gameStates: GameState[],
    readonly winner: string,
    readonly players: [string]
  ) { }
}