import { Board } from "../Classes/GameObjects/Board";
import { Pawn } from "../Classes/GameObjects/Pawn";
import { Player } from "../Classes/GameObjects/Player";
import { RandomIdProvider } from "../Classes/IdProviders/RandomIdProvider";
import { Orientation } from "../Enums/Orientation";
import Pset from "../Classes/Other/Pset";

const idpr = () => new RandomIdProvider(8);

const rules = {
  maxPawn: 4,
  maxWeight: 10,
  boardSize: { x: 10, y: 15 },
  maxAp: 4,
};

function makeBoard(w: number, h: number): Board {
  return Board.getFromSize({ x: w, y: h }, idpr());
}

function makePlayer(): Player {
  return new Player(() => true, "P", "#fff", 1, rules, idpr(), 4, true);
}

describe("Board.getFromSize", () => {
  it("sets maxCrd to size-1 in both axes", () => {
    const board = makeBoard(10, 15);
    expect(board.maxCrd).toEqual({ x: 9, y: 14 });
  });

  it("starts with no slippery or obstructed tiles", () => {
    const board = makeBoard(10, 15);
    expect(Array.from(board.slippery.values())).toHaveLength(0);
    expect(Array.from(board.obstructed.values())).toHaveLength(0);
  });

  it("builds a shiftMap with one row per y and one column per x", () => {
    const board = makeBoard(10, 15);
    expect(board.shiftMap).toHaveLength(15);
    for (const row of board.shiftMap) {
      expect(row).toHaveLength(10);
    }
  });
});

describe("Board.isIn", () => {
  it("accepts in-bound coords (inclusive)", () => {
    const board = makeBoard(5, 5);
    expect(board.isIn({ x: 0, y: 0 })).toBe(true);
    expect(board.isIn({ x: 4, y: 4 })).toBe(true);
    expect(board.isIn({ x: 2, y: 3 })).toBe(true);
  });

  it("rejects negative or out-of-range coords", () => {
    const board = makeBoard(5, 5);
    expect(board.isIn({ x: -1, y: 0 })).toBe(false);
    expect(board.isIn({ x: 0, y: -1 })).toBe(false);
    expect(board.isIn({ x: 5, y: 0 })).toBe(false);
    expect(board.isIn({ x: 0, y: 5 })).toBe(false);
  });
});

describe("Board.movePawn", () => {
  it("moves a pawn to a free target and reports success", () => {
    const board = makeBoard(5, 5);
    const player = makePlayer();
    const pawn = new Pawn(idpr(), { x: 1, y: 1 });
    const ok = board.movePawn(pawn, player, { x: 2, y: 2 });
    expect(ok).toBe(true);
    expect(pawn.pos).toEqual({ x: 2, y: 2 });
  });

  it("refuses to move onto an obstructed tile and leaves the pawn put", () => {
    const board = makeBoard(5, 5);
    const player = makePlayer();
    const pawn = new Pawn(idpr(), { x: 1, y: 1 });
    board.obstructed.add({ x: 2, y: 2 });
    const ok = board.movePawn(pawn, player, { x: 2, y: 2 });
    expect(ok).toBe(false);
    expect(pawn.pos).toEqual({ x: 1, y: 1 });
  });

  it("wraps modulo the board edges (toroidal topology)", () => {
    const board = makeBoard(5, 5); // maxCrd = {4,4}, modulus = 5
    const player = makePlayer();
    const pawn = new Pawn(idpr(), { x: 0, y: 0 });
    // Stepping to x=-1 should wrap to x=4
    const ok = board.movePawn(pawn, player, { x: -1, y: 0 });
    expect(ok).toBe(true);
    expect(pawn.pos).toEqual({ x: 4, y: 0 });
  });
});

describe("Board.movePawnFromPattern", () => {
  it("applies a NORTH step (decreases y by 1)", () => {
    const board = makeBoard(5, 5);
    const player = makePlayer();
    const pawn = new Pawn(idpr(), { x: 2, y: 2 });
    const ok = board.movePawnFromPattern(pawn, player, [Orientation.NORTH]);
    expect(ok).toBe(true);
    expect(pawn.pos).toEqual({ x: 2, y: 1 });
  });

  it("applies a knight pattern (N,N,E) end-to-end", () => {
    const board = makeBoard(5, 5);
    const player = makePlayer();
    const pawn = new Pawn(idpr(), { x: 2, y: 3 });
    const ok = board.movePawnFromPattern(pawn, player, [
      Orientation.NORTH,
      Orientation.NORTH,
      Orientation.EAST,
    ]);
    expect(ok).toBe(true);
    expect(pawn.pos).toEqual({ x: 3, y: 1 });
  });

  it("returns false when the pattern lands on an obstructed tile", () => {
    const board = makeBoard(5, 5);
    const player = makePlayer();
    board.obstructed.add({ x: 2, y: 2 });
    const pawn = new Pawn(idpr(), { x: 2, y: 3 });
    const ok = board.movePawnFromPattern(pawn, player, [Orientation.NORTH]);
    expect(ok).toBe(false);
    expect(pawn.pos).toEqual({ x: 2, y: 3 });
  });
});

describe("Board.copy", () => {
  it("returns an independent slippery/obstructed snapshot", () => {
    const board = makeBoard(5, 5);
    board.obstructed.add({ x: 1, y: 1 });
    const copy = board.copy();
    expect(copy.isObstructed({ x: 1, y: 1 })).toBe(true);
    // mutating the original should not affect the copy
    board.obstructed.add({ x: 2, y: 2 });
    expect(copy.isObstructed({ x: 2, y: 2 })).toBe(false);
  });

  it("preserves the id (CopyIdProvider)", () => {
    const board = makeBoard(5, 5);
    const copy = board.copy();
    expect(copy.id).toBe(board.id);
  });
});
