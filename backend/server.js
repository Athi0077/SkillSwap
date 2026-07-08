require("dotenv").config();

const http = require("http");
const {Server} = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");

const server = http.createServer(app);

const socketHandler = require("./server/socket/socket")

const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST","PUT","DELETE"],
    }
})

socketHandler(io)

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});   