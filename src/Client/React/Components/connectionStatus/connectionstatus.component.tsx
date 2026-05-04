/**
 * ConnectionStatusBanner
 *
 * Single source of truth for "tell the player what's going on with the network".
 * Renders nothing while the socket is healthily connected or has never been
 * asked to connect; otherwise overlays a small banner explaining the state and
 * (where applicable) a Retry button.
 *
 * Design notes:
 *   - Banner sits in the top-right corner so it does not occlude the game
 *     board, which is centred. Pointer-events are scoped to the banner div
 *     itself so the rest of the UI stays interactive while the banner is up.
 *   - Copy is intentionally minimal here. Localised strings can be threaded
 *     through props later without changing the state-transition logic.
 *   - The component is purely presentational on top of `useConnectionState`;
 *     no socket calls live here.
 */

import "./connectionstatus.component.style.scss";
import React, { useCallback } from "react";
import { useConnectionState } from "Client/React/Hooks/useSocket";
import { getSocketClient } from "Client/socketClient";

export const ConnectionStatusBanner: React.FC = () => {
  const state = useConnectionState();

  const onRetry = useCallback(() => {
    getSocketClient().connect();
  }, []);

  // Connected and idle states are silent — no UI noise.
  if (state.status === "connected" || state.status === "idle") {
    return null;
  }

  let tone: "info" | "warn" | "error" = "info";
  let title = "";
  let detail = "";
  let showRetry = false;

  switch (state.status) {
    case "connecting":
      tone = "info";
      title = "Connecting…";
      detail = state.attempt > 0 ? `Attempt ${state.attempt}` : "";
      break;
    case "reconnecting":
      tone = "warn";
      title = "Reconnecting…";
      detail = `Attempt ${state.attempt} · next try in ${Math.round(state.nextDelayMs / 100) / 10}s`;
      break;
    case "disconnected":
      tone = "warn";
      title = "Disconnected";
      detail = state.reason;
      showRetry = true;
      break;
    case "error":
      tone = "error";
      title = "Connection failed";
      detail = state.error.message;
      showRetry = true;
      break;
  }

  return (
    <div className={`ConnectionStatusBanner ConnectionStatusBanner--${tone}`} role="status" aria-live="polite">
      <div className="ConnectionStatusBanner__title">{title}</div>
      {detail && <div className="ConnectionStatusBanner__detail">{detail}</div>}
      {showRetry && (
        <button type="button" className="ConnectionStatusBanner__retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
};

export default ConnectionStatusBanner;
