import { ShownCardType } from "../Classes/CardTypes/ShownCardType";
import { getFromAttackRange } from "./Modifiers";
import { Action } from "../Classes/Other/Action";

export const ShownCardTypes: { [key: string]: () => ShownCardType } = {
  sneakydaggers: () => new ShownCardType({
    weight: 0,
    name: "Sneaky Daggers",
    picturePath: "",
    maxTurn: 999,
    maxGame: 999,
    actions: [
      new Action(1, "contactActionTitle", "contactActionDesc", getFromAttackRange(1)
    )]
  })
}