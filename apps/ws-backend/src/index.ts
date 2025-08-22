import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8000 });

wss.on("connection", function (ws, request) {
  const url = request.url;

  if (!url) {
    return;
  }
  const queryPramms = new URLSearchParams(url.split("?")[1]);
  const token = queryPramms.get("token");
  
  if (!token) {
    ws.close();
    return;
  }
  
  const decoded = jwt.verify(token, JWT_SECRET);

  if (!decoded || !(decoded as JwtPayload).userId) {
    ws.close();
    return;
  }

  ws.on("message", function message(e) {
    ws.send("pong");
  });
});
