import { DeckChecker } from "./Classes/GameObjects/Player";
import { Card } from "./Classes/GameObjects/Card";
import { Vec2 } from "./Types/Vec2";

const superDeckChecker: DeckChecker = function (cards: Card[]) {
  return true;
}

function main(args?: string[]) {
  const set1 = new Set<Vec2>();
  set1.add({ x: 10, y: 10 });
  set1.add({ x: 4, y: -1 });

  console.log(set1.has({ x: 10, y: 10 }));
}

main();