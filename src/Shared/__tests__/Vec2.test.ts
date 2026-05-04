import { add } from "../Types/Vec2";

describe("Vec2.add", () => {
  it("adds component-wise", () => {
    expect(add({ x: 1, y: 2 }, { x: 3, y: 4 })).toEqual({ x: 4, y: 6 });
  });

  it("handles negatives", () => {
    expect(add({ x: 5, y: 5 }, { x: -2, y: -3 })).toEqual({ x: 3, y: 2 });
  });

  it("does not mutate inputs", () => {
    const a = { x: 1, y: 1 };
    const b = { x: 2, y: 2 };
    add(a, b);
    expect(a).toEqual({ x: 1, y: 1 });
    expect(b).toEqual({ x: 2, y: 2 });
  });
});
