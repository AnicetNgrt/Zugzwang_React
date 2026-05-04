import { Orientation, getVec, reOrient } from "../Enums/Orientation";

describe("Orientation.getVec", () => {
  it("maps each cardinal to the expected unit vector", () => {
    expect(getVec(Orientation.NORTH)).toEqual({ x: 0, y: -1 });
    expect(getVec(Orientation.EAST)).toEqual({ x: 1, y: 0 });
    expect(getVec(Orientation.SOUTH)).toEqual({ x: 0, y: 1 });
    expect(getVec(Orientation.WEST)).toEqual({ x: -1, y: 0 });
  });
});

describe("Orientation.reOrient", () => {
  it("returns a same-length list", () => {
    const path = [Orientation.NORTH, Orientation.NORTH, Orientation.WEST];
    expect(reOrient(path, Orientation.NORTH)).toHaveLength(path.length);
  });

  it("is identity when rotating by NORTH (0)", () => {
    const path = [Orientation.NORTH, Orientation.EAST, Orientation.SOUTH, Orientation.WEST];
    expect(reOrient(path, Orientation.NORTH)).toEqual(path);
  });

  it("rotates a NORTH step into EAST when rotating by EAST", () => {
    expect(reOrient([Orientation.NORTH], Orientation.EAST)).toEqual([Orientation.EAST]);
  });

  it("rotates clockwise: NORTH -> EAST -> SOUTH -> WEST -> NORTH", () => {
    expect(reOrient([Orientation.NORTH], Orientation.SOUTH)).toEqual([Orientation.SOUTH]);
    expect(reOrient([Orientation.WEST], Orientation.EAST)).toEqual([Orientation.NORTH]);
  });

  it("rotates a knight pattern coherently", () => {
    // knight east = N,N,E. Rotated by EAST → E,E,S
    const knightEast = [Orientation.NORTH, Orientation.NORTH, Orientation.EAST];
    expect(reOrient(knightEast, Orientation.EAST)).toEqual([
      Orientation.EAST,
      Orientation.EAST,
      Orientation.SOUTH,
    ]);
  });
});
