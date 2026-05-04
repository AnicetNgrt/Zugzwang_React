import { Player } from "../Classes/GameObjects/Player";
import { Pawn } from "../Classes/GameObjects/Pawn";
import { Card } from "../Classes/GameObjects/Card";
import { RandomIdProvider } from "../Classes/IdProviders/RandomIdProvider";
import { DisplacementCardTypes } from "../Consts/DisplacementCardTypes";

const idpr = () => new RandomIdProvider(8);

const rules = {
  maxPawn: 4,
  maxWeight: 10,
  boardSize: { x: 10, y: 15 },
  maxAp: 4,
};

const makePlayer = () =>
  new Player(() => true, "alice", "#fff", 1, rules, idpr(), 0, false);

const card = (factory: () => any) =>
  new Card(factory(), 0, 999, idpr(), true);

describe("Player.canAddCard", () => {
  it("accepts a card that fits within the weight cap", () => {
    const player = makePlayer();
    expect(player.canAddCard(card(DisplacementCardTypes.apollo))).toBe(true); // weight 3
  });

  it("rejects a card that would exceed the weight cap", () => {
    const player = makePlayer();
    player.addCard(card(DisplacementCardTypes.knight)); // weight 8
    // remaining cap = 2, knight is 8 → reject
    expect(player.canAddCard(card(DisplacementCardTypes.knight))).toBe(false);
  });

  it("rejects a duplicate card type by name even if weight allows", () => {
    const player = makePlayer();
    player.addCard(card(DisplacementCardTypes.smallRivers)); // weight 0
    expect(player.canAddCard(card(DisplacementCardTypes.smallRivers))).toBe(false);
  });

  it("respects a custom deckChecker", () => {
    const reject = new Player(
      () => false,
      "bob",
      "#000",
      1,
      rules,
      idpr(),
      0,
      false
    );
    expect(reject.canAddCard(card(DisplacementCardTypes.smallRivers))).toBe(false);
  });
});

describe("Player.addCard / removeCard", () => {
  it("addCard returns true and stores the card on success", () => {
    const player = makePlayer();
    const c = card(DisplacementCardTypes.apollo);
    expect(player.addCard(c)).toBe(true);
    expect(player.hand.has(c)).toBe(true);
  });

  it("addCard returns false and does not store on rejection", () => {
    const player = makePlayer();
    player.addCard(card(DisplacementCardTypes.knight)); // weight 8
    const overweight = card(DisplacementCardTypes.knight);
    expect(player.addCard(overweight)).toBe(false);
    expect(player.hand.has(overweight)).toBe(false);
  });

  it("removeCard takes the card out of the hand", () => {
    const player = makePlayer();
    const c = card(DisplacementCardTypes.apollo);
    player.addCard(c);
    player.removeCard(c);
    expect(player.hand.has(c)).toBe(false);
  });
});

describe("Player.owns", () => {
  it("recognises owned pawns", () => {
    const player = makePlayer();
    const pawn = new Pawn(idpr(), { x: 0, y: 0 });
    player.givePawn(pawn);
    expect(player.owns(pawn)).toBe(true);
  });

  it("does not claim pawns belonging to someone else", () => {
    const a = makePlayer();
    const b = makePlayer();
    const pawn = new Pawn(idpr(), { x: 0, y: 0 });
    a.givePawn(pawn);
    expect(b.owns(pawn)).toBe(false);
  });

  it("recognises owned cards", () => {
    const player = makePlayer();
    const c = card(DisplacementCardTypes.apollo);
    player.addCard(c);
    expect(player.owns(c)).toBe(true);
  });
});

describe("Player.getHandWeight", () => {
  it("sums the weights of all cards in hand", () => {
    const player = makePlayer();
    player.addCard(card(DisplacementCardTypes.apollo)); // 3
    player.addCard(card(DisplacementCardTypes.clockMaker)); // 7
    expect(player.getHandWeight()).toBe(10);
  });

  it("is zero for an empty hand", () => {
    expect(makePlayer().getHandWeight()).toBe(0);
  });
});

describe("Player.copy", () => {
  it("preserves identity, hand and pawns", () => {
    const player = makePlayer();
    const c = card(DisplacementCardTypes.apollo);
    const pawn = new Pawn(idpr(), { x: 1, y: 1 });
    player.addCard(c);
    player.givePawn(pawn);
    const cp = player.copy();
    expect(cp.id).toBe(player.id);
    expect(cp.name).toBe(player.name);
    expect(cp.team).toBe(player.team);
    expect(cp.hand.has(c)).toBe(true);
    expect(cp.pawns.has(pawn)).toBe(true);
  });
});
