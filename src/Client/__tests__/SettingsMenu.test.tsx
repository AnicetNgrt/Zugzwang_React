/**
 * Settings menu interaction test.
 *
 * Settings persistence flows from these widgets up through onSettingChange and
 * into App.changeSettings, which then calls storeData(). Here we verify the
 * UI-side half of that contract: the right key/value pair is emitted when the
 * user toggles fullscreen, picks a language, picks a resolution, or submits a
 * username. (The localStorage write itself is exercised by client.test.ts.)
 */
jest.mock("Client/Assets/sounds/sounds", () => ({
  sounds: new Proxy(
    {},
    { get: () => ({ play: () => 0, fade: () => 0 }) }
  ),
}));

jest.mock("Client/Assets/Assets", () => ({
  backgroundsImgs: {
    default: "background.png",
    lobby: "lobby.png",
    settings: "settings.png",
    game: "game.png",
  },
}));

import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SettingsMenuComponent from "../React/Components/settingsmenu/settingsmenu.component";

afterEach(cleanup);

const loc: Locs = {
  // labels for buttons / titles used by SettingsMenu
  f: "Back",
  g: "Language",
  h: "Username",
  i: "(desc)",
  j: "Save",
  k: "Fullscreen",
  l: "Resolution",
  "0": "English",
};

const locs: { [key: string]: Locs } = { en: loc };

const resolutions = {
  "1080": "1920x1080 HD 16:9",
  "720": "1280x720 16:9",
};

function renderSettings(onSettingChange = jest.fn(), onSceneRequest = jest.fn()) {
  return {
    onSettingChange,
    onSceneRequest,
    ...render(
      <SettingsMenuComponent
        loc={loc}
        locs={locs}
        resolutions={resolutions}
        onSceneRequest={onSceneRequest}
        onSettingChange={onSettingChange}
        currentSettings={{
          lang: "en",
          username: "alice",
          fullscreen: true,
          resolution: "1080",
        }}
      />
    ),
  };
}

describe("SettingsMenu", () => {
  it("renders all sections", () => {
    const { getByText } = renderSettings();
    expect(getByText(/Username/)).toBeInTheDocument();
    expect(getByText(/Language/)).toBeInTheDocument();
    expect(getByText(/Fullscreen/)).toBeInTheDocument();
    expect(getByText(/Resolution/)).toBeInTheDocument();
  });

  it("emits onSettingChange('language', id) when a language is picked", () => {
    const { onSettingChange, getByText } = renderSettings();
    fireEvent.click(getByText("English"));
    expect(onSettingChange).toHaveBeenCalledWith("language", "en");
  });

  it("emits onSettingChange('resolution', id) when a resolution is picked", () => {
    const { onSettingChange, getByText } = renderSettings();
    fireEvent.click(getByText("1280x720 16:9"));
    expect(onSettingChange).toHaveBeenCalledWith("resolution", "720");
  });

  it("toggles fullscreen with onSettingChange('fullscreen', !current)", () => {
    const { onSettingChange, getByText } = renderSettings();
    // currentSettings.fullscreen=true, so clicking should propose `false`
    fireEvent.click(getByText(/Fullscreen/));
    expect(onSettingChange).toHaveBeenCalledWith("fullscreen", false);
  });

  it("requests the previous scene when Back is clicked", () => {
    const { onSceneRequest, getByText } = renderSettings();
    fireEvent.click(getByText(/Back/));
    expect(onSceneRequest).toHaveBeenCalledWith("back");
  });

  it("submits a new username when the form is submitted with valid input", () => {
    const onSettingChange = jest.fn();
    const { container } = renderSettings(onSettingChange);
    const input = container.querySelector(
      "input[type='text']"
    ) as HTMLInputElement;
    expect(input).not.toBeNull();
    // regex requires 3-12 chars; "alice" is already valid, just type a new one
    fireEvent.change(input, { target: { value: "carol" } });
    const form = input.closest("form")!;
    fireEvent.submit(form);
    expect(onSettingChange).toHaveBeenCalledWith("username", "carol");
  });

  it("does NOT submit a username that fails the regex (too short)", () => {
    const onSettingChange = jest.fn();
    const { container } = renderSettings(onSettingChange);
    const input = container.querySelector(
      "input[type='text']"
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "ab" } }); // < 3 chars → invalid
    const form = input.closest("form")!;
    fireEvent.submit(form);
    // No username change should have fired
    expect(
      onSettingChange.mock.calls.find((c) => c[0] === "username")
    ).toBeUndefined();
  });
});
