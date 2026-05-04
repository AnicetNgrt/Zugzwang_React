# Patherns Socket.io Protocol

Version: 1 (introduced in branch `feat/socket-networking-audit`).

This document is the canonical reference for the network protocol between the
Patherns Electron/React client and the Node/Express Socket.io server. The
TypeScript event signatures live in
[`src/Shared/Api/SocketProtocol.ts`](../src/Shared/Api/SocketProtocol.ts) and
must stay in sync with this file.

## 1. Transport

- **Library:** Socket.io v4.x (server: `socket.io`, client: `socket.io-client`).
- **Default URL:** `ws://localhost:4443` in development; production URL is
  injected via the `url` option of `getSocketClient`.
- **Transports:** `websocket` preferred, `polling` fallback.
- **Auth:** clients pass `{ auth: { token } }` during the handshake. Guest
  sessions are issued with no token and upgraded later via `loginGuest`.
- **Heartbeat:** server defaults — `pingInterval=25s`, `pingTimeout=20s`.

## 2. Connection lifecycle

```
       ┌──────┐
       │ idle │
       └──┬───┘
          │ connect()
          ▼
   ┌────────────┐  connect_error    ┌──────────────┐
   │ connecting │──────────────────▶│ reconnecting │
   └─────┬──────┘                    └──────┬───────┘
         │ connect                          │ exhausted
         ▼                                  ▼
   ┌───────────┐                     ┌──────────┐
   │ connected │──── disconnect ────▶│  error   │
   └───────────┘                     └──────────┘
         │ disconnect()
         ▼
   ┌──────────────┐
   │ disconnected │
   └──────────────┘
```

The client's `SocketClient` (in `src/Client/socketClient.ts`) owns this state
machine. Reconnection is **bounded**: after `maxAttempts` failed attempts the
state transitions to `error` and the user must press **Retry** in the
`ConnectionStatusBanner` (or whatever UI is wired to `getSocketClient().connect()`).

### Backoff

Delay between reconnection attempts is exponential with jitter:

```
delay(attempt) = min(maxDelay, initialDelay * 2^(attempt-1)) ± jitter
```

Defaults: `initialDelay=500ms`, `maxDelay=15s`, `jitter=0.3`, `maxAttempts=8`.

## 3. Acks vs broadcasts

Two complementary mechanisms are used:

| Mechanism            | Use for                                              | Failure mode                  |
| -------------------- | ---------------------------------------------------- | ----------------------------- |
| **Ack callback**     | Request/response from client → server (login, ping). | Client's `request()` rejects. |
| **`error` broadcast**| Asynchronous server-pushed errors not tied to a req. | UI shows banner; logged.       |

Every ack payload follows the discriminated union `Ack<T>`:

```ts
{ ok: true,  data: T } | { ok: false, error: SocketError }
```

`SocketError` always carries a stable `code` (machine-readable) and a
human-readable `message`.

## 4. Server → Client events

| Event                  | Payload                                                                 | When                                                                  |
| ---------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `connectionConfirmed`  | `SessionInfo`                                                           | Once, immediately after the handshake completes.                      |
| `message`              | `Message` (chat / system)                                               | Server broadcasts a chat or notice to all clients in scope.           |
| `login`                | `{ ok:true, user } \| { ok:false, error }`                              | Async login flows that don't fit the request/ack model (e.g. SSO).    |
| `serverShutdown`       | `{ reason: string; retryAfterMs: number }`                              | Graceful shutdown. Clients should not reconnect before `retryAfterMs`.|
| `error`                | `SocketError`                                                           | Out-of-band server error not tied to a specific client request.       |

## 5. Client → Server events

| Event         | Args                                              | Ack data                            | Errors                                                |
| ------------- | ------------------------------------------------- | ----------------------------------- | ----------------------------------------------------- |
| `loginGuest`  | `LoginData` (username only)                       | `SessionInfo`                       | `INVALID_PAYLOAD`, `RATE_LIMITED`, `INTERNAL`         |
| `login`       | `LoginData` (username + password)                 | `SessionInfo`                       | `UNAUTHENTICATED`, `INVALID_PAYLOAD`, `INTERNAL`      |
| `message`     | `Message`                                         | `void` (optional ack)               | `INVALID_PAYLOAD`, `RATE_LIMITED`, `INTERNAL`         |
| `ping`        | `nonce: string`                                   | `{ nonce: string; serverTime }`     | `INTERNAL`                                            |

## 6. Error codes

Every `SocketError.code` value MUST be one of:

- `UNAUTHENTICATED` — the action requires login.
- `INVALID_PAYLOAD` — request shape failed validation.
- `RATE_LIMITED` — caller is exceeding rate limits.
- `LOBBY_NOT_FOUND` — referenced a lobby that does not exist.
- `LOBBY_FULL` — lobby is already at capacity.
- `NOT_IN_LOBBY` — action requires being a lobby member.
- `INTERNAL` — generic server-side failure (logs have details).
- `TIMEOUT` — synthesized client-side when an ack does not arrive in time.

Add new codes by editing `SocketErrorCode` in `SocketProtocol.ts` and
extending the table above in the same PR.

## 7. Adding an event

1. Edit `src/Shared/Api/SocketProtocol.ts`. Add the entry to
   `ServerToClientEvents` or `ClientToServerEvents`.
2. Document the event in §4 or §5 of this file.
3. Add a server-side handler in `src/Server/Server.ts`. Use the helpers `ok`,
   `okVoid`, `err` for ack responses.
4. On the client, call `getSocketClient().request(...)` for ack-style events
   or `getSocketClient().on(...)` for server-pushed events. The TypeScript
   compiler will refuse anything that does not match the protocol.

## 8. Reserved Socket.io events

The following names are emitted by Socket.io itself and must not be redefined
in the protocol maps:

`connect`, `connect_error`, `disconnect`, `disconnecting`, `reconnect`,
`reconnect_attempt`, `reconnect_error`, `reconnect_failed`, `newListener`,
`removeListener`, `ping`, `pong`.

(Note: our application-level `ping` event uses an explicit `nonce` argument and
a typed ack, so it does *not* collide with the engine.io heartbeat ping.)
