import Pset from "../Classes/Other/Pset";
import { Pawn } from "../Classes/GameObjects/Pawn";
import { RandomIdProvider } from "../Classes/IdProviders/RandomIdProvider";

const idpr = () => new RandomIdProvider(8);

describe("Pset (Vec2 keys)", () => {
  it("treats coordinates as the key, not object identity", () => {
    const set = new Pset();
    const a = { x: 3, y: 4 };
    const b = { x: 3, y: 4 };
    set.add(a);
    expect(set.has(b)).toBe(true);
  });

  it("returns false for an absent vector", () => {
    const set = new Pset();
    set.add({ x: 1, y: 1 });
    expect(set.has({ x: 2, y: 1 })).toBe(false);
  });

  it("delete removes the vec by coords", () => {
    const set = new Pset();
    set.add({ x: 0, y: 0 });
    set.delete({ x: 0, y: 0 });
    expect(set.has({ x: 0, y: 0 })).toBe(false);
  });

  it("re-adding the same vec is idempotent", () => {
    const set = new Pset();
    set.add({ x: 5, y: 5 });
    set.add({ x: 5, y: 5 });
    expect(Array.from(set.values())).toHaveLength(1);
  });
});

describe("Pset (GameObject keys)", () => {
  it("uses the GameObject id as key", () => {
    const set = new Pset();
    const pawn = new Pawn(idpr(), { x: 0, y: 0 });
    set.add(pawn);
    expect(set.has(pawn)).toBe(true);
  });

  it("two pawns with different ids are distinct entries", () => {
    const set = new Pset();
    const p1 = new Pawn(idpr(), { x: 0, y: 0 });
    const p2 = new Pawn(idpr(), { x: 1, y: 1 });
    set.add(p1);
    set.add(p2);
    expect(Array.from(set.values())).toHaveLength(2);
  });

  it("a Vec2 lookup never matches a GameObject and vice versa", () => {
    const set = new Pset();
    const pawn = new Pawn(idpr(), { x: 0, y: 0 });
    set.add(pawn);
    expect(set.has({ x: 0, y: 0 })).toBe(false);
  });
});
