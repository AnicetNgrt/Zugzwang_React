/**
 * Patherns game server.
 *
 * Hosts the typed Socket.io endpoint described in
 * `src/Shared/Api/SocketProtocol.ts` and `docs/SOCKET_PROTOCOL.md`.
 *
 * The previous version of this file:
 *   - Used `socket: any` (no payload safety).
 *   - Registered `io.on("loginGuest", ...)` at the *server* level instead of
 *     the per-connection socket level, so the handler could never fire.
 *   - Had no disconnect, error, or shutdown handling — sockets accumulated.
 *   - Awaited a Mongoose connection at module load with no error handling and
 *     unconditionally created a `User` document on every server start.
 *
 * This rewrite addresses all of the above.
 */

import express from "express";
import * as http from "http";
import { Server as IOServer, Socket } from "socket.io";
import * as mongoose from "mongoose";

import { Message } from "../Shared/Api/Message";
import { LoginData } from "../Shared/Api/LoginData";
import { UserModel } from "../Shared/Api/User";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  Ack,
  SocketError,
  SessionInfo,
} from "../Shared/Api/SocketProtocol";

// ─────────────────────────────── Bootstrap ───────────────────────────────────

const PORT = Number(process.env.PORT) || 4443;
const MONGO_USER = process.env.DBU || "admin";
const MONGO_PASS = process.env.DBP || "";
const MONGO_URI =
  process.env.MONGO_URI ||
  `mongodb+srv://${MONGO_USER}:${encodeURIComponent(MONGO_PASS)}@wahlsedev-qr8wy.gcp.mongodb.net/test?retryWrites=true&w=majority`;

async function connectMongo(): Promise<void> {
  if (!MONGO_PASS) {
    console.warn("[Server] DBP env var not set — skipping MongoDB connection.");
    return;
  }
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "",
    } as mongoose.ConnectOptions);
    console.log("[Server] MongoDB connected.");
  } catch (err) {
    console.error("[Server] MongoDB connection failed:", err);
  }
}

// ─────────────────────────────── HTTP server ─────────────────────────────────

const app = express();
app.set("port", process.env.PORT || PORT);

app.get("/healthz", (_req, res) => {
  res.json({ ok: true, mongo: mongoose.connection.readyState === 1 });
});

const httpServer = http.createServer(app);

// ─────────────────────────────── Socket.io ───────────────────────────────────

const io = new IOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  // Reasonable defaults; clients running on flaky home wifi need a generous
  // ping timeout to avoid being kicked during short hiccups.
  pingInterval: 25_000,
  pingTimeout: 20_000,
  cors: { origin: process.env.CORS_ORIGIN || "*" },
});

type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

// Authentication / session bootstrap. Runs before connection event handlers
// so `socket.data.user` is always populated (possibly with `null`).
io.use((socket, next) => {
  socket.data.sessionId = socket.id;
  socket.data.user = null;
  socket.data.connectedAt = Date.now();
  next();
});

io.on("connection", (socket: AppSocket) => {
  console.log(`[Server] connect: ${socket.id} (transport=${socket.conn.transport.name})`);

  // Send the handshake-confirmation event eagerly. The client uses this to
  // distinguish "TCP connection up" from "session established".
  const session: SessionInfo = {
    sessionId: socket.data.sessionId,
    user: socket.data.user,
  };
  socket.emit("connectionConfirmed", session);

  // ── application events ────────────────────────────────────────────────────

  socket.on("loginGuest", async (data: LoginData, ack) => {
    try {
      const sanitized = sanitizeLogin(data);
      if (!sanitized) {
        ack(err("INVALID_PAYLOAD", "username is required and must be 1–32 chars."));
        return;
      }
      socket.data.user = { username: sanitized.username, discriminator: "0000" };
      ack(ok({ sessionId: socket.data.sessionId, user: socket.data.user }));
    } catch (e) {
      console.error("[Server] loginGuest:", e);
      ack(err("INTERNAL", "loginGuest failed."));
    }
  });

  socket.on("login", async (data: LoginData, ack) => {
    try {
      if (!data.username || !data.password) {
        ack(err("INVALID_PAYLOAD", "username and password are required."));
        return;
      }
      // The previous server unconditionally created a user on boot. Real
      // login should look users up; if MongoDB is unreachable we return a
      // typed error rather than crashing.
      if (mongoose.connection.readyState !== 1) {
        ack(err("INTERNAL", "User database is unavailable."));
        return;
      }
      const found = await UserModel.findOne({ username: data.username }).exec();
      if (!found || found.password !== data.password) {
        ack(err("UNAUTHENTICATED", "Invalid username or password."));
        return;
      }
      socket.data.user = { username: found.username, discriminator: found.discriminator };
      ack(ok({ sessionId: socket.data.sessionId, user: socket.data.user }));
    } catch (e) {
      console.error("[Server] login:", e);
      ack(err("INTERNAL", "login failed."));
    }
  });

  socket.on("message", (msg: Message, ack) => {
    try {
      // Trivial validation: real chat would also rate-limit and length-check.
      if (!msg || typeof msg.content !== "string") {
        ack && ack(err("INVALID_PAYLOAD", "message must include string content."));
        return;
      }
      io.emit("message", msg);
      ack && ack(okVoid());
    } catch (e) {
      console.error("[Server] message:", e);
      ack && ack(err("INTERNAL", "message broadcast failed."));
    }
  });

  socket.on("ping", (nonce: string, ack) => {
    ack(ok({ nonce, serverTime: Date.now() }));
  });

  // ── lifecycle ─────────────────────────────────────────────────────────────

  socket.on("disconnect", (reason) => {
    console.log(`[Server] disconnect: ${socket.id} (${reason})`);
  });

  // Surfaced when a handler throws synchronously or the engine reports an
  // error. Without this, errors silently disappear into the void.
  socket.on("error", (e) => {
    console.error(`[Server] socket error (${socket.id}):`, e);
  });
});

// ───────────────────────────── Server lifecycle ──────────────────────────────

void connectMongo();

const server = httpServer.listen(PORT, () => {
  console.log(`[Server] listening on *:${PORT}`);
});

function shutdown(signal: string) {
  console.log(`[Server] received ${signal}, shutting down gracefully…`);
  io.emit("serverShutdown", { reason: signal, retryAfterMs: 5_000 });
  io.close(() => {
    server.close(() => {
      mongoose.disconnect().finally(() => process.exit(0));
    });
  });
  // Hard exit if graceful shutdown drags on.
  setTimeout(() => {
    console.warn("[Server] forced exit after timeout.");
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// ────────────────────────────── helpers ──────────────────────────────────────

function ok<T>(data: T): Ack<T> {
  return { ok: true, data };
}
function okVoid(): Ack<void> {
  return { ok: true, data: undefined };
}
function err(code: SocketError["code"], message: string, details?: Record<string, unknown>): Ack<never> {
  return { ok: false, error: { code, message, details } };
}

function sanitizeLogin(data: LoginData): { username: string } | null {
  if (!data || typeof data.username !== "string") return null;
  const trimmed = data.username.trim();
  if (trimmed.length < 1 || trimmed.length > 32) return null;
  return { username: trimmed };
}
