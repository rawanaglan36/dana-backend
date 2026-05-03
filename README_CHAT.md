## Realtime Chat (Parent ↔ Doctor) — Frontend Integration Guide

This project includes a Socket.IO realtime chat between **Parent (Flutter mobile)** and **Doctor (web dashboard)**.

### Socket URL
- **Socket.IO endpoint**: same backend base URL (default Socket.IO path `/socket.io`)
- **Namespace**: default (not using custom namespace)

Example:
- If API base is `https://api.example.com`, then Socket.IO connects to `https://api.example.com`.

### Authentication (JWT required)
JWT must be sent on the Socket.IO connection using **one** of the following:

1) **Handshake auth**
- Send token as `handshake.auth.token`

2) **Authorization header**
- Send `Authorization: Bearer <JWT>`

On connect, server verifies JWT using `JWT_SECRET`.
- If invalid/missing: the socket is disconnected.
- If valid: payload is stored in `socket.data.user`.

JWT payload shape (existing project):
- `sub`: user id (Mongo ObjectId string)
- `role`: `"parent"` or `"doctor"` (case-insensitive)

### Rooms
Each parent-doctor chat has a unique room:

- **Room id format**: `parentId_doctorId`

### Authorization rules (IMPORTANT)
Server enforces room access:
- If JWT role is `parent` → **must** have `payload.sub === parentId`
- If JWT role is `doctor` → **must** have `payload.sub === doctorId`
- Any other role → unauthorized

This is enforced on **both** `joinRoom` and `sendMessage`.

### Response format
Socket events return data using the project `responseDto` wrapper:

```ts
{
  response: {
    status: number,
    message: string,
    data?: any
  }
}
```

### Events

#### 1) `joinRoom`
Client → Server:

```json
{
  "parentId": "MONGO_OBJECT_ID",
  "doctorId": "MONGO_OBJECT_ID"
}
```

Server → Client (`joinRoom`):

```json
{
  "response": {
    "status": 200,
    "message": "success",
    "data": { "roomId": "parentId_doctorId" }
  }
}
```

Validation:
- `parentId` and `doctorId` must be valid Mongo ObjectId strings.

#### 2) `sendMessage`
Client → Server:

```json
{
  "parentId": "MONGO_OBJECT_ID",
  "doctorId": "MONGO_OBJECT_ID",
  "message": "hello",
  "clientMessageId": "optional-client-generated-id"
}
```

Notes:
- **Sender is determined from JWT** (`socket.data.user.sub`) — do NOT send `senderId`.

Server → Room (`receiveMessage`):

```json
{
  "response": {
    "status": 200,
    "message": "success",
    "data": {
      "_id": "MONGO_OBJECT_ID",
      "roomId": "parentId_doctorId",
      "parentId": "MONGO_OBJECT_ID",
      "doctorId": "MONGO_OBJECT_ID",
      "senderId": "MONGO_OBJECT_ID",
      "receiverId": "MONGO_OBJECT_ID",
      "message": "hello",
      "clientMessageId": "optional-client-generated-id",
      "createdAt": "ISO_DATE"
    }
  }
}
```

### Database persistence (MongoDB)
Each `sendMessage` is saved to `ChatMessage` collection with:
- `parentId`
- `doctorId`
- `roomId` (`parentId_doctorId`)
- `senderId`
- `receiverId`
- `message`
- `createdAt` (auto, timestamps)

### Errors
Common server-side errors:
- Missing/invalid JWT: socket disconnected (connect fails)
- Invalid DTO payload: websocket error with message `check your inputs`
- Unauthorized room access: websocket error `Unauthorized`

### Frontend examples

#### JavaScript (Web) — Socket.IO client

```js
import { io } from "socket.io-client";

const socket = io("https://api.example.com", {
  auth: { token: "<JWT>" },
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("connected", socket.id);
});

socket.on("joinRoom", (data) => {
  console.log("joinRoom response", data);
});

socket.on("receiveMessage", (data) => {
  console.log("receiveMessage", data);
});

socket.emit("joinRoom", { parentId, doctorId });
socket.emit("sendMessage", {
  parentId,
  doctorId,
  message: "Hello",
  clientMessageId: crypto.randomUUID(),
});
```

#### Flutter (Dart) — `socket_io_client`

```dart
import 'package:socket_io_client/socket_io_client.dart' as IO;

final socket = IO.io(
  'https://api.example.com',
  IO.OptionBuilder()
      .setTransports(['websocket'])
      .enableAutoConnect()
      .setAuth({'token': jwt})
      .build(),
);

socket.onConnect((_) {
  print('connected ${socket.id}');
  socket.emit('joinRoom', {'parentId': parentId, 'doctorId': doctorId});
});

socket.on('joinRoom', (data) {
  print('joinRoom $data');
});

socket.on('receiveMessage', (data) {
  print('receiveMessage $data');
});

void sendMsg(String text) {
  socket.emit('sendMessage', {
    'parentId': parentId,
    'doctorId': doctorId,
    'message': text,
    'clientMessageId': DateTime.now().microsecondsSinceEpoch.toString(),
  });
}
```

### Implementation locations (backend)
- Gateway: `src/chat/chat.gateway.ts`
- Guard: `src/chat/guard/socket-jwt.guard.ts`
- Service (authorization + save): `src/chat/realtime-chat.service.ts`
- Schema: `schemas/chatMessage.schema.ts`

