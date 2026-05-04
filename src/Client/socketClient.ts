/**
 * socketClient.ts
 *
 * Typed Socket.io client wrapper for the Patherns multiplayer transport.
 *
 * Responsibilities:
 *   - Lazy, single-instance socket creation (avoids duplicate connections in
 *     React StrictMode / dev hot-reloads).
 *   - End-to-end TypeScript typing of every event via SocketProtocol.
 *   - Explicit, observable connection state machine (idle → connecting →
 *     connected → reconnecting → disconnected/error).
 *   - Reconnection with bounded attempts and exponential backoff. Falls back
 *     to a permanent "error" state once exhausted, instead of looping forever.
 *   - Per-emit timeouts: client-to-server requests with an ack reject after
 *     `EMIT_TIMEOUT_MS` instead of hanging indefinitely.
 *   - Replaces the previous commented-out client code in `client.ts`.
 *
 * Compatibility:
 *   This file is written against the typed generics introduced in
 *   socket.io-client >= 3.x. The repository's `package.json` is being bumped
 *   from 2.3 to 4.x as part of the same change.
 */

import io, { Socket } from "socket.io-client";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  Ack,
  SocketError,
} from "Shared/Api/SocketProtocol";

// ───────────────────────────── Configuration ─────────────────────────────────

export interface SocketClientOptions {
  /** Full origin of the game server, e.g. "https://patherns.example.com". */
  url: string;
  /** Optional auth token forwarded in the `auth` payload. */
  token?: string;
  /** Override defaults for tests. */
  reconnection?: ReconnectionOptions;
  /** Override the default ack timeout (ms). */
  emitTimeoutMs?: number;
  /** Override the default connect timeout (ms). */
  connectTimeoutMs?: number;
}

export interface ReconnectionOptions {
  /** Max attempts before transitioning to permanent "error". */
  maxAttempts: number;
  /** Initial backoff in ms. Doubled each attempt up to `maxDelayMs`. */
  initialDelayMs: number;
  /** Cap for exponential backoff. */
  maxDelayMs: number;
  /** Random jitter factor [0..1] applied to each delay. */
  jitter: number;
}

const DEFAULT_RECONNECTION: ReconnectionOptions = {
  maxAttempts: 8,
  initialDelayMs: 500,
  maxDelayMs: 15_000,
  jitter: 0.3,
};

const DEFAULT_EMIT_TIMEOUT_MS = 10_000;
const DEFAULT_CONNECT_TIMEOUT_MS = 10_000;

// ─────────────────────────── Connection state ────────────────────────────────

export type ConnectionState =
  | { status: "idle" }
  | { status: "connecting"; attempt: number }
  | { status: "connected"; sessionId: string | null }
  | { status: "reconnecting"; attempt: number; nextDelayMs: number }
  | { status: "disconnected"; reason: string }
  | { status: "error"; error: SocketError };

export type ConnectionStateListener = (state: ConnectionState) => void;

// ────────────────────────────── Implementation ───────────────────────────────

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export class SocketClient {
  private socket: TypedSocket | null = null;
  private state: ConnectionState = { status: "idle" };
  private listeners = new Set<ConnectionStateListener>();
  private readonly opts: Required<Omit<SocketClientOptions, "token">> & { token?: string };
  private explicitlyClosed = false;

  constructor(options: SocketClientOptions) {
    this.opts = {
      url: options.url,
      token: options.token,
      reconnection: { ...DEFAULT_RECONNECTION, ...(options.reconnection ?? {}) },
      emitTimeoutMs: options.emitTimeoutMs ?? DEFAULT_EMIT_TIMEOUT_MS,
      connectTimeoutMs: options.connectTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS,
    };
  }

  /** Current state snapshot. Use `subscribe` for live updates. */
  getState(): ConnectionState {
    return this.state;
  }

  /** Returns `true` only when the underlying socket is fully connected. */
  isConnected(): boolean {
    return this.state.status === "connected";
  }

  /**
   * Open the connection. Idempotent: calling while already connecting or
   * connected is a no-op.
   */
  connect(): void {
    if (this.socket && (this.state.status === "connecting" || this.state.status === "connected")) {
      return;
    }
    this.explicitlyClosed = false;
    this.setState({ status: "connecting", attempt: 0 });

    // We disable socket.io-client's built-in reconnection because we run our
    // own state machine on top — combining the two leads to confusing,
    // double-counted retries and racing state transitions.
    const socket: TypedSocket = io(this.opts.url, {
      autoConnect: true,
      reconnection: false,
      timeout: this.opts.connectTimeoutMs,
      transports: ["websocket", "polling"],
      auth: this.opts.token ? { token: this.opts.token } : undefined,
    });

    this.socket = socket;
    this.wireLifecycle(socket);
  }

  /**
   * Close the connection deliberately. Suppresses the auto-reconnect path so
   * a user-initiated logout does not trigger backoff retries.
   */
  disconnect(reason: string = "client_disconnect"): void {
    this.explicitlyClosed = true;
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.setState({ status: "disconnected", reason });
  }

  /** Subscribe to state changes. Returns an unsubscribe function. */
  subscribe(listener: ConnectionStateListener): () => void {
    this.listeners.add(listener);
    // Push current state synchronously so subscribers do not need to read
    // `getState()` separately to render an initial UI.
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Type-safe wrapper around `socket.on`. Returns an unsubscribe function so
   * React effects can clean up without bookkeeping.
   */
  on<K extends keyof ServerToClientEvents>(
    event: K,
    handler: ServerToClientEvents[K],
  ): () => void {
    if (!this.socket) {
      throw new Error(`SocketClient.on("${String(event)}"): connect() must be called first.`);
    }
    // socket.io's `.on` signature is overloaded; the explicit cast keeps the
    // generics aligned without weakening the public API.
    this.socket.on(event, handler as never);
    const socket = this.socket;
    return () => {
      socket.off(event, handler as never);
    };
  }

  /**
   * Fire-and-forget emit. Drops the call (and warns) if the socket is not
   * currently connected, instead of silently buffering forever.
   */
  emit<K extends keyof ClientToServerEvents>(
    event: K,
    ...args: Parameters<ClientToServerEvents[K]>
  ): void {
    if (!this.socket || !this.isConnected()) {
      console.warn(
        `[SocketClient] Dropping emit "${String(event)}" — socket not connected (state=${this.state.status}).`,
      );
      return;
    }
    (this.socket.emit as (ev: K, ...a: unknown[]) => unknown)(event, ...(args as unknown[]));
  }

  /**
   * Request/response emit. Wraps the trailing ack callback in a Promise that
   * rejects on timeout, server-side error, or disconnect. Use this for any
   * client-initiated operation that needs a confirmed result.
   */
  request<K extends RequestEventNames>(
    event: K,
    ...args: RequestArgs<K>
  ): Promise<RequestResult<K>> {
    return new Promise<RequestResult<K>>((resolve, reject) => {
      if (!this.socket || !this.isConnected()) {
        reject(this.makeError("INTERNAL", `Cannot emit "${String(event)}": not connected.`));
        return;
      }

      let settled = false;
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        reject(this.makeError("TIMEOUT", `Request "${String(event)}" timed out after ${this.opts.emitTimeoutMs}ms.`));
      }, this.opts.emitTimeoutMs);

      const ack = (response: Ack<RequestResult<K>>) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (response.ok) {
          resolve(response.data);
        } else {
          reject(response.error);
        }
      };

      (this.socket.emit as (ev: K, ...a: unknown[]) => unknown)(event, ...(args as unknown[]), ack);
    });
  }

  // ───────────────────────────── private ─────────────────────────────────────

  private wireLifecycle(socket: TypedSocket): void {
    socket.on("connect", () => {
      this.setState({ status: "connected", sessionId: socket.id ?? null });
    });

    // Surfaced when the *initial* handshake or a reconnect attempt fails
    // (network down, CORS, server unreachable, auth rejection, …).
    socket.on("connect_error", (err: Error) => {
      // If the user has disconnected in the meantime, do not retry.
      if (this.explicitlyClosed) return;
      this.scheduleReconnect(err.message || "connect_error");
    });

    socket.on("disconnect", (reason: string) => {
      // "io client disconnect" means we called .disconnect() ourselves.
      if (reason === "io client disconnect" || this.explicitlyClosed) {
        this.setState({ status: "disconnected", reason });
        return;
      }
      // "io server disconnect" means the server kicked us; reconnects will
      // not happen automatically in socket.io v4 unless we re-call connect().
      this.scheduleReconnect(reason);
    });

    // Application-level error stream (separate from transport errors).
    socket.on("error", (error: SocketError) => {
      console.error("[SocketClient] server-pushed error:", error);
    });

    socket.on("serverShutdown", (info: { reason: string; retryAfterMs: number }) => {
      // Honour the server's backoff hint instead of immediately retrying.
      this.explicitlyClosed = true;
      socket.disconnect();
      this.setState({
        status: "error",
        error: this.makeError("INTERNAL", `Server shutting down: ${info.reason}`, { retryAfterMs: info.retryAfterMs }),
      });
    });
  }

  private scheduleReconnect(reason: string): void {
    if (this.explicitlyClosed) return;

    const prevAttempt =
      this.state.status === "reconnecting"
        ? this.state.attempt
        : this.state.status === "connecting"
        ? this.state.attempt
        : 0;
    const attempt = prevAttempt + 1;

    if (attempt > this.opts.reconnection.maxAttempts) {
      this.setState({
        status: "error",
        error: this.makeError(
          "INTERNAL",
          `Reconnection gave up after ${this.opts.reconnection.maxAttempts} attempts (last reason: ${reason}).`,
        ),
      });
      return;
    }

    const nextDelayMs = computeBackoff(attempt, this.opts.reconnection);
    this.setState({ status: "reconnecting", attempt, nextDelayMs });

    setTimeout(() => {
      if (this.explicitlyClosed) return;
      // Tear down the previous instance before creating a new one — sockets
      // accumulate stale listeners across reconnects otherwise.
      if (this.socket) {
        this.socket.removeAllListeners();
        this.socket.disconnect();
        this.socket = null;
      }
      // Carry the attempt counter forward so the next failure is counted
      // against the same budget.
      this.setState({ status: "connecting", attempt });
      const socket: TypedSocket = io(this.opts.url, {
        autoConnect: true,
        reconnection: false,
        timeout: this.opts.connectTimeoutMs,
        transports: ["websocket", "polling"],
        auth: this.opts.token ? { token: this.opts.token } : undefined,
      });
      this.socket = socket;
      this.wireLifecycle(socket);
    }, nextDelayMs);
  }

  private setState(state: ConnectionState): void {
    this.state = state;
    for (const l of this.listeners) {
      try {
        l(state);
      } catch (e) {
        // A buggy subscriber must not break the transport.
        console.error("[SocketClient] subscriber threw:", e);
      }
    }
  }

  private makeError(
    code: SocketError["code"],
    message: string,
    details?: Record<string, unknown>,
  ): SocketError {
    return { code, message, details };
  }
}

// ──────────────────────────── Helper types ───────────────────────────────────

/**
 * Subset of ClientToServerEvents whose handler signature ends with an ack
 * callback. `request()` only accepts those event names so misuse is a compile
 * error at call sites.
 */
type LastParam<T extends (...args: any) => any> = Parameters<T> extends [...infer _, infer L]
  ? L
  : never;

type IsAck<T> = T extends (response: Ack<any>) => void ? true : false;

export type RequestEventNames = {
  [K in keyof ClientToServerEvents]: IsAck<LastParam<ClientToServerEvents[K]>> extends true ? K : never;
}[keyof ClientToServerEvents];

type DropLast<T extends unknown[]> = T extends [...infer Head, unknown] ? Head : [];

export type RequestArgs<K extends RequestEventNames> = DropLast<Parameters<ClientToServerEvents[K]>>;

export type RequestResult<K extends RequestEventNames> =
  LastParam<ClientToServerEvents[K]> extends (response: Ack<infer R>) => void ? R : never;

// ─────────────────────────────── Backoff ─────────────────────────────────────

export function computeBackoff(attempt: number, opts: ReconnectionOptions): number {
  // attempt is 1-indexed. delay = min(maxDelay, initial * 2^(attempt-1)) ± jitter.
  const exp = opts.initialDelayMs * Math.pow(2, attempt - 1);
  const capped = Math.min(opts.maxDelayMs, exp);
  const jitterRange = capped * opts.jitter;
  const jitter = (Math.random() * 2 - 1) * jitterRange;
  return Math.max(0, Math.round(capped + jitter));
}

// ─────────────────────────────── Singleton ───────────────────────────────────

let singleton: SocketClient | null = null;

/**
 * Obtain the process-wide SocketClient. The first call must provide options;
 * subsequent calls return the same instance regardless of arguments. This
 * mirrors how the rest of the app treats `getLocalData` / `storeData` — a
 * single transport per Electron renderer process.
 */
export function getSocketClient(options?: SocketClientOptions): SocketClient {
  if (!singleton) {
    if (!options) {
      throw new Error(
        "getSocketClient(): first call must include options (url, token, …).",
      );
    }
    singleton = new SocketClient(options);
  }
  return singleton;
}

/** Test-only: drops the singleton so a fresh instance can be constructed. */
export function __resetSocketClientForTests(): void {
  if (singleton) singleton.disconnect("test_reset");
  singleton = null;
}
