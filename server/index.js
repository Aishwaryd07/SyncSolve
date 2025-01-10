const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http')
const { Server } = require('socket.io')
require("dotenv").config();
 
const db_config = require('./config/db.config')
const auth_config = require('./config/auth.config')
const authMW = require('./middleware/auth.mw')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
      origin: "*",
      methods: ['GET', 'POST'], // Allowed HTTP methods
  },
});
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect(db_config.DB_url);

const db = mongoose.connection

db.on("error",(err) => {
  console.log("error while connnecting to the database", err);
})

db.once("open", () => {
  console.log("connected to the database..")
})


const secretKey = auth_config.secretKey;


io.on('connection', (socket) => {
  console.log('A user connected');

  // Join a room
  socket.on('joinRoom', ({ roomCode }) => {
    socket.join(roomCode);
    console.log(`User joined room: ${roomCode}`);
  });

  // Leave a room
  socket.on('leaveRoom', ({ roomCode }) => {
    socket.leave(roomCode);
    console.log(`User left room: ${roomCode}`);
  });

  // Send and receive messages
  socket.on('sendMessage', ({ roomCode, message}) => {
    io.to(roomCode).emit('receiveMessage', message); // Broadcast message to the room
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});




/* stitch routes to the server */
require("./routes/auth.routes")(app);
require("./routes/room.routes")(app);
require("./routes/question.routes")(app);
require("./routes/friend.routes")(app);


// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

//for socket 
server.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`)
})
