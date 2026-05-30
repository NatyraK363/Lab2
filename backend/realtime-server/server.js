const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const Redis = require("ioredis");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const subscriber = new Redis({
    host: "127.0.0.1",
    port: 6379
});

subscriber.subscribe("notifications");

subscriber.on("message", (channel, message) => {
    console.log("Notification received:", message);

    io.emit("notification", JSON.parse(message));
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(3001, () => {
    console.log("Realtime server running on port 3001");
});