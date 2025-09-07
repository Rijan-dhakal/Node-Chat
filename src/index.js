import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

const onlineUsers = [];

io.on("connection", (socket) => {
  // socket refers to client
  io.emit("info", {reason: "connected", userId:socket.id});
  onlineUsers.push(socket.id);

  io.emit("status", onlineUsers.length);

  socket.on("disconnect", ()=>{
    io.emit("info", {reason:"disconnected", userId:socket.id})
    const index = onlineUsers.indexOf(socket.id)
    if(index !== -1){
       onlineUsers.splice(index, 1);
       io.emit("status", onlineUsers.length)
    }
  })

  socket.on("chat-msg", (msg) => {
    io.emit("message", { msg: msg, senderId: socket.id });
  });
});

// sending HTML File
app.get("/", (req, res) => {
  res.sendFile("./public/index.html");
});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
