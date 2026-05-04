/**
 * SocketProtocol.ts
 *
 * Single source of truth for the Socket.io event contract used between the
 * Patherns (Zugzwang_React) Electron + React client and its Node/Express
 * Socket.io server. Both sides import from here so that adding, renaming, or
 * changing the payload of an event is a compile error in any consumer that has
 * not been updated.
 *
 * The interfaces below are designed to be consumed by socket.io >= 3.x typed
 * generics: `Socket<ServerToClientEvents, ClientToServerEvents>` on the client
 * and `Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents,
 * SocketData>` on the server.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * NOTE FOR FUTURE CONTRIBUTORS
 * ──────────────────────────────────────────────────────────────────────────
 * Every event added here MUST also be documented in docs/SOCKET_PROTOCOL.md
 * (direction, payload, ack contract, who emits it and when).
 */

import { Message } from "./Message";
import { LoginData } from "./LoginData";

// ────────────────────────────── Reusable shapes ───────────────────────────────

/**
 * Generic acknowledgement payload returned by the server for any
 * client-to-server event that opts into request/response semantics. The client
 * passes a callback to `socket.emit` and the server invokes it with this shape.
 */
export type Ack<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: SocketError };

export interface SocketError {
  /**
   * Stable machine-readable code. Use these for branching in the UI rather
   * than parsing `message`. Add new codes here, do not invent ad-hoc strings.
   */
  code: SocketErrorCode;
  /** Human-readable English message. UI may localize on `code`. */
  message: string;
  /** Optional structured details (validation field paths, retry hints, etc.). */
  details?: Record<string, unknown>;
}

export type SocketErrorCode =
  | "UNAUTHENTICATED"
  | "INVALID_PAYLOAD"
  | "RATE_LIMITED"
  | "LOBBY_NOT_FOUND"
  | "LOBBY_FULL"
  | "NOT_IN_LOBBY"
  | "INTERNAL"
  | "TIMEOUT";

// ─────────────────────────── Public session shape ────────────────────────────

export interface PublicUser {
  username: string;
  discriminator: string;
}

export interface SessionInfo {
  sessionId: string;
  user: PublicUser | null;
}

// ─────────────────────────────── Event maps ──────────────────────────────────

/**
 * Server → Client events. Keys are event names; values are the handler
 * signature on the client side. Every payload is a pure JSON-serialisable
 * object: do NOT include class instances with methods, since Socket.io will
 * silently drop the methods on the wire.
 */
export interface ServerToClientEvents {
  /** Emitted once after the connection handshake completes. */
  connectionConfirmed: (session: SessionInfo) => void;

  /** Chat / system messages broadcast by the server. */
  message: (msg: Message) => void;

  /** Login result pushed by the server (used when login is async / SSO). */
  login: (result: { ok: true; user: PublicUser } | { ok: false; error: SocketError }) => void;

  /** Server is going down, clients should not attempt immediate reconnect. */
  serverShutdown: (info: { reason: string; retryAfterMs: number }) => void;

  /**
   * Generic recoverable error pushed out-of-band (i.e. not as an ack).
   * Prefer acks for request/response flows; use this only for asynchronous
   * server-side errors that the client did not directly request.
   */
  error: (error: SocketError) => void;
}

/**
 * Client → Server events. Most flows use the ack callback as the response
 * channel; events without an ack are fire-and-forget.
 */
export interface ClientToServerEvents {
  /** Guest login (no password). Server replies via ack. */
  loginGuest: (data: LoginData, ack: (response: Ack<SessionInfo>) => void) => void;

  /** Authenticated login. Server replies via ack. */
  login: (data: LoginData, ack: (response: Ack<SessionInfo>) => void) => void;

  /** Application-level chat message; broadcast by the server on success. */
  message: (msg: Message, ack?: (response: Ack) => void) => void;

  /** Application-level liveness probe. Server replies with the same nonce. */
  ping: (nonce: string, ack: (response: Ack<{ nonce: string; serverTime: number }>) => void) => void;
}

/**
 * Inter-server events for socket.io clusters / adapters. Empty for now; the
 * field exists so the server-side generic signature stays stable when we do
 * adopt a Redis adapter.
 */
export interface InterServerEvents {
  // intentionally empty
}

/**
 * Per-socket server-side data attached to the connection. Populated by the
 * authentication middleware and read by event handlers.
 */
export interface SocketData {
  sessionId: string;
  user: PublicUser | null;
  /** ms-since-epoch the connection was accepted; used for idle timeouts. */
  connectedAt: number;
}

// ─────────────────────────── Reserved event names ────────────────────────────

/**
 * Event names reserved by Socket.io itself (i.e. emitted by the library, not
 * by application code). Listed for reference so they are not accidentally
 * redefined in the maps above.
 */
export const RESERVED_EVENTS = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "reconnect",
  "reconnect_attempt",
  "reconnect_error",
  "reconnect_failed",
  "newListener",
  "removeListener",
  "ping",
  "pong",
] as const;
