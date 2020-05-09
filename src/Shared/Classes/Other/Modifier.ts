import { GameState } from "./GameState";
import { GameObject } from "../GameObjects/GameObject";

export class Modifier {
  constructor(
    readonly inputs: {[key:string]:{ typeName: string, count: number, justification: string }},
    readonly outputs: string[][],
    readonly checkPrerequisites: (gameState: GameState, objects: { [key: string]: GameObject[] }) => boolean
  ) { 

  }

  private checkHasItAll(objects: { [key: string]: GameObject[] }) {

  }

}