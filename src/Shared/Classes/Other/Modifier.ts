import { GameState } from "../GameObjects/GameState";
import { GameObject } from "../GameObjects/GameObject";
import { ObjectsNames } from "../GameObjects/ObjectsNames";

export type ModifierObjects = { [key: string]: GameObject[] };
export type ModifierInput = { className: ObjectsNames, count: number, justification?: string };
export type ModifierInputs = { [key: string]: ModifierInput };
export type ModifierEffect = { name: string, old: GameObject, new: GameObject };
export type ModifierConclusion = { success: boolean, effects: ModifierEffect[] };
export function getFailedConclusion(): ModifierConclusion { return { success: false, effects:[]} };

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
        if (object.getStaticClassName() !== this.inputs[key].className) return false;
        count++;
      }
      if (count !== this.inputs[key].count) return false;
    }
    return true;
  }

  execute(gameState:GameState, objects: ModifierObjects): ModifierConclusion {
    if (!this.checkHasItAll(objects)) return getFailedConclusion();
    return this.executeBlind(gameState, objects);
  }
}