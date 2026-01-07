# 🚀 Development Guide

Complete guide for developing, extending, and deploying the Excalidraw collaborative drawing application.

## 📑 Table of Contents

1. [API Documentation](#api-documentation)
2. [WebSocket Protocol](#websocket-protocol)
3. [Database Schema](#database-schema)
4. [Architecture](#architecture)
5. [Feature Development](#feature-development)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## 🔌 API Documentation

### Base URL
- Development: `http://localhost:3001`
- Production: Your production server URL

### Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

### 1. **POST /signup**
Create a new user account.

**Request:**
```json
{
  "username": "john_doe",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Validation Rules:**
- Username: 3-80 characters
- Password: 8-64 characters, must include:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- Name: Required, trimmed

**Response (200):**
```json
{
  "userId": "uuid-string",
  "message": "User created successfully"
}
```

**Error Responses:**
- `400`: Incorrect input validation failed
- `409`: User already exists with this username
- `500`: Internal server error

---

### 2. **POST /signin**
Authenticate user and receive JWT token.

**Request:**
```json
{
  "username": "john_doe",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "token": "jwt-token-string",
  "userId": "uuid-string"
}
```

**Error Responses:**
- `400`: Incorrect input validation failed
- `401`: Invalid credentials
- `500`: Internal server error

---

### 3. **POST /room**
Create a new drawing room.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "slug": "my-awesome-room"
}
```

**Response (200):**
```json
{
  "roomId": 123,
  "slug": "my-awesome-room",
  "createdAt": "2025-01-08T10:30:00Z"
}
```

**Error Responses:**
- `400`: Invalid input
- `401`: Unauthorized
- `409`: Room slug already exists
- `500`: Internal server error

---

### 4. **GET /room/:slug**
Get room details and join information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "roomId": 123,
  "slug": "my-awesome-room",
  "createdAt": "2025-01-08T10:30:00Z",
  "admin": {
    "id": "uuid",
    "name": "John Doe"
  }
}
```

**Error Responses:**
- `401`: Unauthorized
- `404`: Room not found
- `500`: Internal server error

---

### 5. **GET /room/:slug/shapes**
Get all shapes in a room.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "shape-id-1",
    "type": "rect",
    "x": 100,
    "y": 100,
    "width": 200,
    "height": 150
  },
  {
    "id": "shape-id-2",
    "type": "circle",
    "centerX": 300,
    "centerY": 300,
    "radius": 50
  }
]
```

**Error Responses:**
- `401`: Unauthorized
- `404`: Room not found
- `500`: Internal server error

---

## 🔄 WebSocket Protocol

The WebSocket server runs on port `8080` and handles real-time drawing synchronization.

### Connection

**URL:**
```
ws://localhost:8080?token=<jwt-token>
```

**Client Connection Example (JavaScript):**
```typescript
const token = localStorage.getItem('token');
const socket = new WebSocket(`ws://localhost:8080?token=${token}`);

socket.onopen = () => console.log('Connected');
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // Handle message
};
```

---

### Message Types

#### 1. **chat** - Broadcasting shapes
When a user draws a shape, it's broadcasted to all users in the room.

**Send (client to server):**
```json
{
  "type": "chat",
  "message": "{\"shape\":{\"id\":\"123\",\"type\":\"rect\",\"x\":100,\"y\":100,\"width\":200,\"height\":150}}",
  "roomId": "my-room"
}
```

**Receive (server to clients):**
```json
{
  "type": "chat",
  "message": "{\"shape\":{\"id\":\"123\",\"type\":\"rect\",\"x\":100,\"y\":100,\"width\":200,\"height\":150}}"
}
```

---

#### 2. **delete_shape** - Delete a shape
Remove a shape from the canvas.

**Send:**
```json
{
  "type": "delete_shape",
  "shapeId": "shape-id-123",
  "roomId": "my-room"
}
```

**Receive:**
```json
{
  "type": "delete_shape",
  "shapeId": "shape-id-123"
}
```

---

#### 3. **camera_update** - Pan and zoom sync
Synchronize canvas view (pan and zoom) across users.

**Send:**
```json
{
  "type": "camera_update",
  "cameraOffset": {"x": 100, "y": 50},
  "cameraZoom": 1.5,
  "roomId": "my-room"
}
```

**Receive:**
```json
{
  "type": "camera_update",
  "cameraOffset": {"x": 100, "y": 50},
  "cameraZoom": 1.5
}
```

---

### Shape Types

#### Rectangle
```json
{
  "id": "unique-id",
  "type": "rect",
  "x": 100,
  "y": 100,
  "width": 200,
  "height": 150
}
```

#### Circle
```json
{
  "id": "unique-id",
  "type": "circle",
  "centerX": 300,
  "centerY": 300,
  "radius": 50
}
```

#### Pencil (Freehand)
```json
{
  "id": "unique-id",
  "type": "pencil",
  "points": [
    {"x": 100, "y": 100},
    {"x": 105, "y": 102},
    {"x": 110, "y": 105}
  ]
}
```

#### Arrow
```json
{
  "id": "unique-id",
  "type": "arrow",
  "x1": 100,
  "y1": 100,
  "x2": 300,
  "y2": 300
}
```

#### Line
```json
{
  "id": "unique-id",
  "type": "line",
  "x1": 100,
  "y1": 100,
  "x2": 300,
  "y2": 300
}
```

#### Text
```json
{
  "id": "unique-id",
  "type": "text",
  "x": 100,
  "y": 100,
  "text": "Hello World",
  "fontSize": 20
}
```

---

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE "User" (
  id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email    VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  name     VARCHAR NOT NULL,
  photo    VARCHAR
);
```

**Fields:**
- `id`: Unique user identifier (UUID)
- `email`: User's email (unique)
- `password`: Hashed password (bcrypt with salt rounds: 10)
- `name`: User's display name
- `photo`: Profile photo URL (optional)

---

### Rooms Table
```sql
CREATE TABLE "Room" (
  id        SERIAL PRIMARY KEY,
  slug      VARCHAR UNIQUE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  adminId   UUID NOT NULL REFERENCES "User"(id)
);
```

**Fields:**
- `id`: Unique room identifier
- `slug`: URL-friendly room name (unique)
- `createdAt`: Room creation timestamp
- `adminId`: User who created the room

---

### Chats Table
```sql
CREATE TABLE "Chat" (
  id        SERIAL PRIMARY KEY,
  message   TEXT NOT NULL,
  roomId    INT NOT NULL REFERENCES "Room"(id),
  userId    UUID NOT NULL REFERENCES "User"(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Unique message identifier
- `message`: Shape data (JSON stringified)
- `roomId`: Associated room
- `userId`: User who created the shape
- `createdAt`: Creation timestamp

---

## 🏗️ Architecture

### System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Next.js 15 Frontend (React 19)                       │  │
│  │  - Canvas Drawing Interface                           │  │
│  │  - Tool Selection (rect, circle, pencil, etc.)       │  │
│  │  - Pan & Zoom Controls                                │  │
│  └────────────┬──────────────────────────────────────────┘  │
└───────────────┼──────────────────────────────────────────────┘
                │
       ┌────────┴─────────┐
       │                  │
┌──────▼──────┐    ┌──────▼──────┐
│ HTTP API    │    │  WebSocket  │
│ (3001)      │    │  (8080)     │
│             │    │             │
│ Endpoints:  │    │ Messages:   │
│ - /signup   │    │ - chat      │
│ - /signin   │    │ - delete_   │
│ - /room     │    │   shape     │
│ - /shapes   │    │ - camera_   │
│             │    │   update    │
└──────┬──────┘    └──────┬──────┘
       │                  │
       └──────────┬───────┘
                  │
         ┌────────▼────────┐
         │  PostgreSQL DB  │
         │  (5432)         │
         │                 │
         │ - Users         │
         │ - Rooms         │
         │ - Chats/Shapes  │
         └─────────────────┘
```

### Data Flow for Drawing

1. **User draws shape** on canvas
2. **Client broadcasts** via WebSocket: `{type: "chat", message: JSON.stringify(shape)}`
3. **Server receives** shape and broadcasts to all connected clients in room
4. **Server saves** shape to database
5. **All clients** receive and render the shape
6. **Shape persists** in database for future sessions

---

## 🎨 Feature Development

### Adding a New Drawing Tool

**Step 1: Update Shape Type** (`packages/common/src/type.ts`)
```typescript
export const ShapeSchema = z.union([
  // ... existing shapes ...
  z.object({
    id: z.string().optional(),
    type: z.literal("new-tool"),
    // Your tool-specific properties
    property1: z.number(),
    property2: z.string()
  })
]);
```

**Step 2: Add Tool to UI** (`apps/excelidraw-frontend/Components/Canvas.tsx`)
```typescript
export type Tool = "rect" | "circle" | "pencil" | "arrow" | "line" | "text" | "eraser" | "new-tool";
```

**Step 3: Implement Drawing Logic** (`apps/excelidraw-frontend/app/draw/game.ts`)
```typescript
// In mouseDownHandler
if (this.selectedTool === "new-tool") {
  this.currentNewToolPath = [{ x: worldCoords.x, y: worldCoords.y }];
}

// In mouseMoveHandler
if (selectedTool === "new-tool") {
  this.currentNewToolPath.push({ x: worldCoords.x, y: worldCoords.y });
  // Draw preview on canvas
}

// In mouseUpHandler
if (selectedTool === "new-tool") {
  shape = {
    id: Date.now().toString() + Math.random().toString(36),
    type: "new-tool",
    property1: value1,
    property2: value2
  };
}
```

**Step 4: Implement Rendering** (`apps/excelidraw-frontend/app/draw/game.ts` - `clearCanvas()` method)
```typescript
else if (shape.type === "new-tool") {
  this.ctx.strokeStyle = "rgba(your, color, values, 0.9)";
  this.ctx.lineWidth = 2;
  // Draw your shape
}
```

---

### Adding an API Endpoint

**Step 1: Create handler** (`apps/http-backend/src/index.ts`)
```typescript
app.get("/api/data/:id", async (req, res) => {
  try {
    // Authenticate user
    const user = middleware(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // Fetch data
    const data = await prismaClient.yourModel.findUnique({
      where: { id: req.params.id }
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
```

**Step 2: Add TypeScript validation** (`packages/common/src/type.ts`)
```typescript
export const YourDataSchema = z.object({
  id: z.string(),
  property: z.string()
});
```

**Step 3: Call from frontend**
```typescript
const response = await fetch('http://localhost:3001/api/data/123', {
  headers: { Authorization: `Bearer ${token}` }
});
const data = await response.json();
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] Sign up with valid credentials
- [ ] Sign up with invalid password (should fail)
- [ ] Sign in with correct credentials
- [ ] Sign in with wrong password (should fail)
- [ ] Token persists in localStorage

#### Drawing
- [ ] Draw rectangle
- [ ] Draw circle
- [ ] Draw pencil strokes
- [ ] Draw arrow
- [ ] Draw line
- [ ] Draw text
- [ ] Use eraser
- [ ] Pan canvas (middle mouse or Shift+drag)
- [ ] Zoom in/out (mouse wheel)
- [ ] Reset zoom

#### Real-time Collaboration
- [ ] Open app in two browser windows
- [ ] Draw in one window
- [ ] Shape appears in other window
- [ ] Delete shape in one window
- [ ] Shape disappears in other window
- [ ] Pan in one window
- [ ] Other window updates camera position

#### Persistence
- [ ] Refresh page
- [ ] Shapes still visible
- [ ] Camera state (pan/zoom) restored

---

## 🔧 Troubleshooting

### Backend Issues

**Module not found error**
```bash
# Clear and reinstall
pnpm store prune
rm -rf node_modules packages/*/node_modules
pnpm install
```

**Database connection fails**
```bash
# Check PostgreSQL is running
psql postgresql://postgres:postgres@localhost:5432/excalidraw

# Check .env DATABASE_URL
cat .env | grep DATABASE_URL
```

**Port already in use**
```bash
# Find process using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Frontend Issues

**WebSocket connection fails**
- Check WS backend is running on port 8080
- Verify JWT token is valid
- Check browser console for errors
- Try: `curl http://localhost:8080` (should upgrade)

**Shapes not appearing**
- Check browser console for errors
- Verify WebSocket connection is open
- Check Network tab in DevTools
- Verify shapes are being sent via WebSocket

**Performance issues**
- Reduce number of shapes
- Increase camera zoom to reduce rendering
- Check browser performance tab

---

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Docs](https://expressjs.com/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Prisma Docs](https://www.prisma.io/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

