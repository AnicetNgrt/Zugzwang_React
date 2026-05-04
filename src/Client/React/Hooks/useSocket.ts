/**
 * useSocket — React hooks for the typed Socket.io client.
 *
 *   useConnectionState()    Re-renders the component whenever the socket
 *                           connection state machine transitions. Used by the
 *                           connection-status banner.
 *
 *   useSocketEvent(ev, fn)  Subscribes to a server-to-client event for the
 *                           lifetime of the component. Cleans up on unmount,
 *                           which fixes the very common "listener registered
 *                           N times after re-renders" bug.
 */

import { useEffect, useState } from "react";
import { getSocketClient, ConnectionState } from "Client/socketClient";
import { ServerToClientEvents } from "Shared/Api/SocketProtocol";

export function useConnectionState(): ConnectionState {
  const client = getSocketClient();
  const [state, setState] = useState<ConnectionState>(client.getState());

  useEffect(() => {
    // subscribe() pushes the current value synchronously, so we don't need a
    // separate setState() before subscribing.
    return client.subscribe(setState);
  }, [client]);

  return state;
}

export function useSocketEvent<K extends keyof ServerToClientEvents>(
  event: K,
  handler: ServerToClientEvents[K],
): void {
  const client = getSocketClient();

  // We intentionally re-subscribe on every render where `handler` identity
  // changes. Callers who care about referential stability should wrap their
  // handler in `useCallback`. This is the same trade-off React makes for
  // `useEffect` deps and avoids the closure-staleness pitfalls of capturing
  // `handler` in a ref.
  useEffect(() => {
    if (client.getState().status === "idle") {
      // No-op: the socket has not been told to connect yet. The component
      // will re-run this effect once connect() is called and a re-render
      // happens (typically driven by useConnectionState elsewhere).
      return;
    }
    return client.on(event, handler);
  }, [client, event, handler]);
}
