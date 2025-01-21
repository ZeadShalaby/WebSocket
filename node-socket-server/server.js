// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const Redis = require("ioredis");
// const cors = require("cors");

// const app = express();

// // السماح بالـ CORS
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// const redis = new Redis(); // الاتصال بـ Redis

// // الاشتراك في قناة chat-channel
// redis.subscribe("chat-channel", (err, count) => {
//   if (err) {
//     console.error("Failed to subscribe: %s", err.message);
//   } else {
//     console.log(`Subscribed to ${count} channel(s).`);
//   }
// });

// // عندما تصلك رسالة عبر Redis
// redis.on("message", (channel, message) => {
//   console.log(`Received message on channel ${channel}:`, message); // عرض الرسالة في التيرمينال

//   try {
//     const parsedMessage = JSON.parse(message); // تحليل الرسالة
//     console.log("Parsed message:", parsedMessage); // عرض الرسالة المحللة

//     // إرسال الرسالة للعملاء المتصلين عبر Socket.IO
//     io.emit(channel, parsedMessage);
//   } catch (error) {
//     console.error("Error parsing message:", error); // إذا كان هناك خطأ في التحليل
//   }
// });

// server.listen(3000, () => {
//   console.log("Socket.IO server running on http://localhost:3000");
// });

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.post("/send-message", (req, res) => {
  const { text, user } = req.body;

  if (!text || !user) {
    return res.status(400).json({ error: "Missing text or user" });
  }

  console.log("Message received from Laravel:", { text, user });

  io.emit("chat-channel", { text, user });

  res.json({ status: "Message broadcasted successfully" });
});

server.listen(3000, () => {
  console.log("Socket.IO server running on http://localhost:3000");
});
