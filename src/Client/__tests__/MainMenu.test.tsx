/**
 * Smoke + interaction test for the main menu scene.
 *
 * The main menu is the entry point to gameplay (`Play` -> lobby) and to settings
 * (`Settings` -> settings menu). We mock out heavy/irrelevant dependencies (sounds,
 * static assets) so this test stays focused on the navigation contract.
 */
jest.mock("Client/Assets/sounds/sounds", () => ({
  sounds: new Proxy(
    {},
    {
      get: () => ({ play: () => 0, fade: () => 0 }),
    }
  ),
}));

jest.mock("Client/Assets/Assets", () => ({
  backgroundsImgs: { default: "background.png", lobby: "lobby.png", settings: "settings.png", game: "game.png" },
}));

import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import MainMenuComponent from "../React/Components/mainmenu/mainmenu.component";

const loc: Locs = {
  // Just enough keys for the main menu — labels for the two buttons.
  c: "Settings",
  d: "Play",
};

afterEach(cleanup);

describe("MainMenu", () => {
  it("renders the Play and Settings labels", () => {
    const { getByText } = render(
      <MainMenuComponent loc={loc} onSceneRequest={() => {}} />
    );
    expect(getByText(/Play/)).toBeInTheDocument();
    expect(getByText(/Settings/)).toBeInTheDocument();
  });

  it("requests the lobby scene when the Play button is clicked", () => {
    const onSceneRequest = jest.fn();
    const { getByText } = render(
      <MainMenuComponent loc={loc} onSceneRequest={onSceneRequest} />
    );
    fireEvent.click(getByText(/Play/));
    expect(onSceneRequest).toHaveBeenCalledWith("lobby");
  });

  it("requests the settings scene when the Settings button is clicked", () => {
    const onSceneRequest = jest.fn();
    const { getByText } = render(
      <MainMenuComponent loc={loc} onSceneRequest={onSceneRequest} />
    );
    fireEvent.click(getByText(/Settings/));
    expect(onSceneRequest).toHaveBeenCalledWith("settings");
  });

  it("does not navigate spuriously on render", () => {
    const onSceneRequest = jest.fn();
    render(<MainMenuComponent loc={loc} onSceneRequest={onSceneRequest} />);
    expect(onSceneRequest).not.toHaveBeenCalled();
  });
});
