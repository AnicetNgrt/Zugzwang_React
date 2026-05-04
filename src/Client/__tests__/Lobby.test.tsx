/**
 * Lobby state machine test.
 *
 * The lobby is a small FSM:
 *   - start with one filled local slot + N-1 empty slots
 *   - clicking "+" fills an empty slot with a local player
 *   - each local player has a ready toggle
 *   - once every slot is filled AND every player is ready, the Play button appears
 *
 * We mock sounds + asset modules so the test stays focused on that contract.
 */
jest.mock("Client/Assets/sounds/sounds", () => ({
  sounds: new Proxy(
    {},
    { get: () => ({ play: () => 0, fade: () => 0 }) }
  ),
}));

jest.mock("Client/Assets/Assets", () => ({
  backgroundsImgs: { lobby: "lobby.png" },
  cardsImgs: new Proxy({}, { get: () => "card.png" }),
}));

import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import LobbyComponent, { Status } from "../React/Components/lobby/lobby.component";

afterEach(cleanup);

const loc: Locs = {
  // labels referenced by the lobby
  m: "Players",
  n: "Back",
  o: "(instr)",
  p: "Ready?",
  q: "Ready",
  r: "Play first",
  s: "Plays first",
  t: "(other)",
  u: "Player",
  v: "Play",
};

const locs: { [key: string]: Locs } = { en: loc };

function renderLobby(overrides: Partial<React.ComponentProps<typeof LobbyComponent>> = {}) {
  const props = {
    loc,
    locs,
    onSceneRequest: jest.fn(),
    username: "alice",
    slots: 2,
    local: true,
    status: Status.LOCAL,
    onLobbyBuilt: jest.fn(),
    ...overrides,
  };
  return { props, ...render(<LobbyComponent {...props} />) };
}

describe("Lobby state machine", () => {
  it("Status enum exposes the three lobby modes", () => {
    expect(Status.HOST).toBe("host");
    expect(Status.CLIENT).toBe("client");
    expect(Status.LOCAL).toBe("local");
  });

  it("starts with one filled slot (the host) and N-1 empty '+' slots", () => {
    const { getAllByText, container } = renderLobby({ slots: 3 });
    // host name appears in the player slot AND the card selector header
    expect(getAllByText("alice").length).toBeGreaterThan(0);
    const empties = container.querySelectorAll(".AddPlayerSlot");
    expect(empties.length).toBe(2);
  });

  it("does NOT show the Play button before all slots are filled", () => {
    const { queryByText } = renderLobby();
    expect(queryByText("Play")).toBeNull();
  });

  it("calls onSceneRequest('back') when Back is clicked", () => {
    const { props, getByText } = renderLobby();
    fireEvent.click(getByText(/Back/));
    expect(props.onSceneRequest).toHaveBeenCalledWith("back");
  });

  it("fills an empty slot when '+' is clicked", () => {
    const { container } = renderLobby();
    const plusSlot = container.querySelector(".AddPlayerSlot")!;
    fireEvent.click(plusSlot);
    // the new slot should now show the localised default name "Player 1"
    expect(container.textContent).toContain("Player 1");
    // and there should be no remaining empty slot
    expect(container.querySelectorAll(".AddPlayerSlot").length).toBe(0);
  });

  it("toggles ready label between 'Ready?' and 'Ready' when clicked", () => {
    const { container, getByText } = renderLobby();
    // host slot starts not-ready → label is loc.p = "Ready?"
    const ready = getByText("Ready?");
    fireEvent.click(ready);
    expect(container.textContent).toContain("Ready");
    expect(container.textContent).not.toContain("Ready?");
  });

  it("only reveals the Play button when every slot is filled AND every player is ready", () => {
    const { container, queryByText, getAllByText } = renderLobby();

    // 1) Play hidden initially
    expect(queryByText("Play")).toBeNull();

    // 2) Fill the empty slot
    fireEvent.click(container.querySelector(".AddPlayerSlot")!);

    // Still no Play — neither player is ready yet
    expect(queryByText("Play")).toBeNull();

    // 3) Toggle ready on both local players
    const readyToggles = getAllByText("Ready?");
    expect(readyToggles.length).toBe(2);
    readyToggles.forEach((el) => fireEvent.click(el));

    // 4) Now Play should be visible
    expect(queryByText("Play")).toBeInTheDocument();
  });
});
