import { GameLobby } from "Shared/Classes/Abstract/GameLobby";

export class ClientSideGameLobby extends GameLobby {

  constructor(
    readonly players: [string]
  ) { 
    super(players);
  }
}