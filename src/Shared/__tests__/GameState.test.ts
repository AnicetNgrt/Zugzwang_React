import { GameState } from "../Classes/GameObjects/GameState";
import { Player } from "../Classes/GameObjects/Player";
import { Pawn } from "../Classes/GameObjects/Pawn";
import { Card } from "../Classes/GameObjects/Card";
import { Board } from "../Classes/GameObjects/Board";
import { RandomIdProvider } from "../Classes/IdProviders/RandomIdProvider";
import { DisplacementCardTypes } from "../Consts/DisplacementCardTypes";

const idpr = () => new RandomIdProvider(8);

const rules = {
  maxPawn: 4,
  maxWeight: 10,
  boardSize: { x: 10, y: 15 },
  maxAp: 4,
};

function makePlayer(name: string, team: number, playing: boolean): Player {
  return new Player(() => true, name, "#fff", team, rules, idpr(), 0, playing);
}

function makeGameState(p1: Player, p2: Player): GameState {
  const board = Board.getFromSize(rules.boardSize, idpr());
  return new GameState([p1, p2], idpr(), board, rules, 0);
}

describe("GameState.currentPlayer", () => {
  it("returns the player whose `playing` flag is set", () => {
    const p1 = makePlayer("alice", 1, true);
    const p2 = makePlayer("bob", 2, false);
    const gs = makeGameState(p1, p2);
    expect(gs.currentPlayer().id).toBe(p1.id);
  });

  it("falls back to the first player if no one is currently playing", () => {
    const p1 = makePlayer("alice", 1, false);
    const p2 = makePlayer("bob", 2, false);
    const gs = makeGameState(p1, p2);
    expect(gs.currentPlayer().id).toBe(p1.id);
  });
});

describe("GameState.nextTurnState", () => {
  it("flips the `playing` flag onto the other player", () => {
    const p1 = makePlayer("alice", 1, true);
    const p2 = makePlayer("bob", 2, false);
    const gs = makeGameState(p1, p2);
    const next = gs.nextTurnState();
    const newP1 = next.players.find((p) => p.id === p1.id)!;
    const newP2 = next.players.find((p) => p.id === p2.id)!;
    expect(newP1.playing).toBe(false);
    expect(newP2.playing).toBe(true);
  });

  it("increments turnCount only on the player who was active", () => {
    const p1 = makePlayer("alice", 1, true);
    const p2 = makePlayer("bob", 2, false);
    const gs = makeGameState(p1, p2);
    const next = gs.nextTurnState();
    const newP1 = next.players.find((p) => p.id === p1.id)!;
    const newP2 = next.players.find((p) => p.id === p2.id)!;
    expect(newP1.turnCount).toBe(1);
    expect(newP2.turnCount).toBe(0);
  });

  it("refills ap to maxAp once the player has taken at least one turn", () => {
    const p1 = makePlayer("alice", 1, true);
    const p2 = makePlayer("bob", 2, false);
    const gs = makeGameState(p1, p2);
    const next = gs.nextTurnState();
    const newP1 = next.players.find((p) => p.id === p1.id)!;
    expect(newP1.ap).toBe(rules.maxAp);
  });

  it("resets card.playedTurn on every player's hand", () => {
    const p1 = makePlayer("alice", 1, true);
    const p2 = makePlayer("bob", 2, false);
    const c = new Card(DisplacementCardTypes.apollo(), 0, 999, idpr(), true);
    c.playedTurn = 2;
    p1.addCard(c);
    const gs = makeGameState(p1, p2);
    const next = gs.nextTurnState();
    const newP1 = next.players.find((p) => p.id === p1.id)!;
    const replayed = Array.from(newP1.hand.values()).filter(
      (x): x is Card => x instanceof Card
    );
    expect(replayed[0].playedTurn).toBe(0);
  });

  it("does not mutate the previous state", () => {
    const p1 = makePlayer("alice", 1, true);
    const p2 = makePlayer("bob", 2, false);
    const gs = makeGameState(p1, p2);
    gs.nextTurnState();
    expect(p1.playing).toBe(true);
    expect(p2.playing).toBe(false);
    expect(p1.turnCount).toBe(0);
  });
});

describe("GameState.findWinner", () => {
  it("returns null when more than one player still has a living pawn", () => {
    const p1 = makePlayer("alice", 1, true);
    const p2 = makePlayer("bob", 2, false);
    p1.givePawn(new Pawn(idpr(), { x: 0, y: 0 }));
    p2.givePawn(new Pawn(idpr(), { x: 1, y: 1 }));
    const gs = makeGameState(p1, p2);
    expect(gs.findWinner()).toBe(null);
  });

  it("returns the sole survivor when only one player has living pawns", () => {
    const p1 = makePlayer("alice", 1, true);
    const p2 = makePlayer("bob", 2, false);
    p1.givePawn(new Pawn(idpr(), { x: 0, y: 0 }));
    const deadPawn = new Pawn(idpr(), { x: 1, y: 1 });
    deadPawn.isAlive = false;
    p2.givePawn(deadPawn);
    const gs = makeGameState(p1, p2);
    expect(gs.findWinner()!.id).toBe(p1.id);
  });

  it("returns null if every player is wiped out", () => {
    const p1 = makePlayer("alice", 1, true);
    const p2 = makePlayer("bob", 2, false);
    const dead1 = new Pawn(idpr(), { x: 0, y: 0 });
    const dead2 = new Pawn(idpr(), { x: 1, y: 1 });
    dead1.isAlive = false;
    dead2.isAlive = false;
    p1.givePawn(dead1);
    p2.givePawn(dead2);
    const gs = makeGameState(p1, p2);
    expect(gs.findWinner()).toBe(null);
  });
});

describe("GameState.findEquivalent", () => {
  it("looks up a Pawn by id across all player hands", () => {
    const p1 = makePlayer("alice", 1, true);
    const p2 = makePlayer("bob", 2, false);
    const pawn = new Pawn(idpr(), { x: 2, y: 2 });
    p2.givePawn(pawn);
    const gs = makeGameState(p1, p2);
    expect(gs.findEquivalent(pawn)).toBe(pawn);
  });

  it("looks up a Player by id", () => {
    const p1 = makePlayer("alice", 1, true);
    const p2 = makePlayer("bob", 2, false);
    const gs = makeGameState(p1, p2);
    expect(gs.findEquivalent(p2)).toBe(p2);
  });

  it("returns null for unknown objects", () => {
    const p1 = makePlayer("alice", 1, true);
    const p2 = makePlayer("bob", 2, false);
    const orphan = new Pawn(idpr(), { x: 0, y: 0 });
    const gs = makeGameState(p1, p2);
    expect(gs.findEquivalent(orphan)).toBe(null);
  });
});

describe("GameState.replacePlayerWith", () => {
  it("swaps in a player by id and reports success", () => {
    const p1 = makePlayer("alice", 1, true);
    const p2 = makePlayer("bob", 2, false);
    const gs = makeGameState(p1, p2);
    const youngerP1 = p1.copy();
    youngerP1.ap = 99;
    expect(gs.replacePlayerWith(youngerP1)).toBe(true);
    expect(gs.players.find((p) => p.id === p1.id)!.ap).toBe(99);
  });

  it("returns false if the player isn't part of the state", () => {
    const p1 = makePlayer("alice", 1, true);
    const p2 = makePlayer("bob", 2, false);
    const gs = makeGameState(p1, p2);
    const stranger = makePlayer("zoe", 3, false);
    expect(gs.replacePlayerWith(stranger)).toBe(false);
  });
});
