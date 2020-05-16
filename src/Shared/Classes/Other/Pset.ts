import { GameObject } from "../GameObjects/GameObject";
import { Vec2 } from "../../Types/Vec2";
import { Card } from "../GameObjects/Card";

export default class PSet {
  map: Map<string, GameObject|Vec2>;
  
  constructor() {
    this.map = new Map<string, GameObject|Vec2>();
  }

  add(item: GameObject | Vec2) {
    if (item instanceof GameObject) {
      return this.map.set(item.id.toString(), item);
    } else {
      return this.map.set(item.x + "|"+item.y, item);
    }
  }

  values() {
    return this.map.values();
  }

  valuesCard(): Card[] {
    const arr: Card[] = [];
    for (var item of Array.from(this.map.values())) {
      if (item instanceof Card) arr.push(item);
    }
    return arr;
  }

  get(key: string) {
    return this.map.get(key);
  }

  has(value: GameObject | Vec2): boolean {
    for (var item of Array.from(this.map.values())) {
      if (value instanceof GameObject && item instanceof GameObject) {
        if (value.id === item.id) {
          return true;
        }
      } else if (value instanceof GameObject || item instanceof GameObject) {
        return false;
      } else if (value.x === item.x && value.y === item.y) {
        return true;
      }
    }
    return false;
  }

  delete(item:GameObject | Vec2) {
    if (item instanceof GameObject) {
      return this.map.delete(item.id.toString());
    } else {
      return this.map.delete(item.x + "|"+item.y);
    }
  }
  // ...
}