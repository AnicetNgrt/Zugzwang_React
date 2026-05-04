/**
 * Local renderer-side persistence helpers.
 *
 * Networking lives in `socketClient.ts`; this file is intentionally limited to
 * synchronous-by-nature key/value storage so it can be imported from anywhere
 * without dragging in the socket transport.
 */

import * as ls from "local-storage";

export const getLocalData = async (key: string): Promise<string | null> => {
  try {
    const value = ls.get<string>(key);
    return value;
  } catch (e) {
    return null;
  }
};

export const storeData = async (key: string, value: string) => {
  try {
    await ls.set<string>(key, value);
  } catch (e) {
    // saving error
  }
};
