import { GameState } from "../GameObjects/GameState";
import { GameObject } from "../GameObjects/GameObject";
import { ObjectsNames } from "../GameObjects/ObjectsNames";

export type ModifierObjects = { [key: string]: any[] };
export type ModifierInput = { className: ObjectsNames, count: number, justification?: string };
export type ModifierInputs = { [key: string]: ModifierInput };
export type ModifierEffect = { name: string, old: GameObject, new: GameObject };
export type ModifierConclusion = { success: boolean, effects: ModifierEffect[], reason?:string };
export function getFailedConclusion(reason:string): ModifierConclusion { return { success: false, effects:[], reason:reason} };

export class Modifier {
  constructor(
    readonly inputs: ModifierInputs,
    private executeBlind: (gameState: GameState, objects: ModifierObjects) => ModifierConclusion
  ) { 

  }

  private checkHasItAll(objects: ModifierObjects):boolean {
    for (const key in objects) {
      if (this.inputs[key] === undefined) return false;
      var count = 0;
      for (const object of objects[key]) {
        if (!(object instanceof GameObject)) {
          if (object.x === undefined || object.x === null || object.y === undefined || object.y === null) return false;
        } else {
          if (object.getStaticClassName() !== this.inputs[key].className) return false;
        }
        count++;
      }
      if (count !== this.inputs[key].count) return false;
    }
    return true;
  }

  execute(gameState:GameState, objects: ModifierObjects): ModifierConclusion {
    if (!this.checkHasItAll(objects)) return getFailedConclusion("don't have everything");
    return this.executeBlind(gameState, objects);
  }
}