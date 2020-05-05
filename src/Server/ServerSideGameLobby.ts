import { GameLobby } from "../Shared/Classes/Abstract/GameLobby";

export class ServerSideGameLobby extends GameLobby {

  constructor(
    readonly players: [string]
  ) { 
    super(players);
  }
}