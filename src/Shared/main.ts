import { Player } from "./Classes/GameObjects/Player";
import { Card } from "./Classes/GameObjects/Card";
import { GameState } from "./Classes/GameObjects/GameState";
import { RandomIdProvider } from "./Classes/IdProviders/RandomIdProvider";
import { Board } from "./Classes/GameObjects/Board";

// eslint-disable-next-line @typescript-eslint/no-unused-vars

function main(args?: string[]) {
  /*const idProvider = new RandomIdProvider(6);
  const rules = {
    maxPawn: 4,
    maxWeight: 10,
    boardSize: { x: 10, y: 15 },
    maxAp: 4
  }

  var anicet: Player = new Player((cards: Set<Card>)=>true, "Anicet", "blue", 1, rules, idProvider, 4, false);
  var thibo: Player = new Player((cards: Set<Card>)=>true, "Thibo", "red", 2, rules, idProvider, 4);
  var players: Player[] = [anicet, thibo];

  var board: Board = Board.getFromSize(rules.boardSize, idProvider);
  var cgs = new GameState(players, idProvider, board, rules, 0);
  console.log(JSON.stringify(cgs, null, 2));*/
}

main();