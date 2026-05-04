import { getLocalData, storeData } from "../client";

beforeEach(() => {
  window.localStorage.clear();
});

describe("client localStorage wrapper", () => {
  it("round-trips a simple string through storeData / getLocalData", async () => {
    await storeData("username", "alice");
    expect(await getLocalData("username")).toBe("alice");
  });

  it("returns null for a key that was never written", async () => {
    expect(await getLocalData("never-written")).toBeNull();
  });

  it("overwrites an existing value", async () => {
    await storeData("lang", "en");
    await storeData("lang", "fr");
    expect(await getLocalData("lang")).toBe("fr");
  });

  it("stores JSON-serialised structured data verbatim", async () => {
    const payload = JSON.stringify({ loggedIn: true, sessionId: "abc" });
    await storeData("loginData", payload);
    const raw = await getLocalData("loginData");
    expect(raw).toBe(payload);
    expect(JSON.parse(raw as string)).toEqual({ loggedIn: true, sessionId: "abc" });
  });

  it("persists each setting key independently (mirrors App settings flow)", async () => {
    // Mirrors App.changeSettings: each setting writes its own key.
    await storeData("lang", "fr");
    await storeData("username", "alice");
    await storeData("fullscreen", "true");
    await storeData("resolution", "1080");

    expect(await getLocalData("lang")).toBe("fr");
    expect(await getLocalData("username")).toBe("alice");
    expect(await getLocalData("fullscreen")).toBe("true");
    expect(await getLocalData("resolution")).toBe("1080");
  });
});
