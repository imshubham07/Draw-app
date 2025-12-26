import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: Set<string>;
  userId: string;
}

const users = new Map<WebSocket, User>();

// Verify JWT safely
function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      userId?: string;
    };
    return decoded.userId ?? null;
  } catch {
    return null;
  }
}

// Safe broadcast helper
function broadcast(roomId: string, data: unknown) {
  const payload = JSON.stringify(data);
  for (const { ws, rooms } of users.values()) {
    if (rooms.has(roomId) && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(payload);
      } catch (err) {
        console.error("Broadcast error:", err);
      }
    }
  }
}

wss.on("connection", (ws, request) => {
  try {
    const url = request.url;
    if (!url) return ws.close();

    const query = new URLSearchParams(url.split("?")[1]);
    const token = query.get("token");
    if (!token) return ws.close();

    const userId = verifyToken(token);
    if (!userId) return ws.close();

    const user: User = { ws, userId, rooms: new Set() };
    users.set(ws, user);

    console.log(`✅ User ${userId} connected (${users.size} active)`);

    // ---- Message Handling ----
    ws.on("message", async (raw) => {
      try {
          let parsedData;
        const msg = JSON.parse(raw.toString());

        switch (msg.type) {
          case "join_room": {
            const roomId = String(msg.roomId); // Convert to string
            if (!roomId) return;
            user.rooms.add(roomId);
            console.log(`👥 User ${userId} joined room ${roomId}`);
            break;
          }

          case "leave_room": {
            const roomId = String(msg.roomId); // Convert to string
            if (!roomId) return;
            user.rooms.delete(roomId);
            console.log(`🚪 User ${userId} left room ${roomId}`);
            break;
          }

          case "chat": {
            const { roomId: rawRoomId, message } = msg;
            const roomId = String(rawRoomId); // Convert to string

            if (!message || typeof message !== "string") return;

            const numericRoomId = Number(roomId);

            if (isNaN(numericRoomId)) return;

            // Check if user joined the room first
            if (!user.rooms.has(roomId)) {
              return;
            }

            // validate room
            const room = await prismaClient.room.findUnique({
              where: { id: numericRoomId },
            });

            if (!room) return;

            await prismaClient.chat.create({
              data: { roomId: numericRoomId, message, userId },
            });

            broadcast(roomId, {
              type: "chat",
              roomId,
              message,
              senderId: userId,
              timestamp: Date.now(),
            });
            break;
          }

          case "camera_update": {
            const { roomId: rawRoomId, cameraOffset, cameraZoom } = msg;
            const roomId = String(rawRoomId);

            // Check if user joined the room first
            if (!user.rooms.has(roomId)) {
              return;
            }

            // Broadcast camera update to all users in the room
            broadcast(roomId, {
              type: "camera_update",
              roomId,
              cameraOffset,
              cameraZoom,
              senderId: userId,
              timestamp: Date.now(),
            });
            break;
          }

          case "delete_shape": {
            const { roomId: rawRoomId, shapeId } = msg;
            const roomId = String(rawRoomId);
            const numericRoomId = Number(roomId);

            if (isNaN(numericRoomId) || !shapeId) return;

            // Check if user joined the room first
            if (!user.rooms.has(roomId)) {
              return;
            }

            // Find and delete the chat message containing this shape
            const chats = await prismaClient.chat.findMany({
              where: { roomId: numericRoomId },
            });

            for (const chat of chats) {
              try {
                const parsedMessage = JSON.parse(chat.message);
                if (parsedMessage.shape && parsedMessage.shape.id === shapeId) {
                  await prismaClient.chat.delete({
                    where: { id: chat.id },
                  });
                  break;
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }

            // Broadcast deletion to all users in the room
            broadcast(roomId, {
              type: "delete_shape",
              roomId,
              shapeId,
              senderId: userId,
              timestamp: Date.now(),
            });
            break;
          }

          default:
            console.warn("⚠️ Unknown message type:", msg.type);
        }
      } catch (err) {
        console.error("❌ Error handling message:", err);
        // optional: send error to client
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({ type: "error", message: "Invalid request" })
          );
        }
      }
    });

    ws.on("close", () => {
      users.delete(ws);
      console.log(`❌ User ${userId} disconnected (${users.size} active)`);
    });

    ws.on("error", (err) => {
      console.error("WS error:", err);
      ws.close();
    });
  } catch (err) {
    console.error("Connection error:", err);
    ws.close();
  }
});
