// const bodyParser = require("body-parser");
// const express = require("express");
// const app = express();
// const cors= require('cors');
// const hostname = "127.0.0.1";
// const port = 5000;
// const path = require("path");
// const sequelizee = require("./config");
// const adminroute = require('./routes/admin.routes');
// const userroute = require('./routes/user.routes')
// const nativeroute = require('./routes/native.route')
// require('dotenv').config();
// const { deleteExpiredAds } = require('./controllers/scheduledTasks');

// deleteExpiredAds.start();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(cors());

// app.use('/admin', adminroute)
// app.use('/user', userroute)
// app.use('/native', nativeroute)


// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

// app.get("*", function (req, res) {
//   res.status(404).send("404 error: page not found");
// });

// sequelizee.sync().then(() => {
//     app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });
//   });

const bodyParser = require("body-parser");
const express = require("express");
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const cors = require('cors');
const hostname = "127.0.0.1";
const port = 5000;
const path = require("path");
const sequelize = require("./config"); // Make sure this points to your Sequelize config file
const adminRoute = require('./routes/admin.routes');
const userRoute = require('./routes/user.routes');
const nativeRoute = require('./routes/native.route');
const Chatbox = require('./models/chatbox.model'); // Ensure this points to your Chatbox model file
require('dotenv').config();
const { deleteExpiredAds } = require('./controllers/scheduledTasks');
const { Op } = require("sequelize");

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: "*",  // Adjust this to match the client URL
    methods: ["GET", "POST"]
  }
});

// Scheduled task initiation
deleteExpiredAds.start();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
  origin: 'http://localhost:5173', // Frontend server address
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Route setups
app.use('/admin', adminRoute);
app.use('/user', userRoute);
app.use('/native', nativeRoute);

// Handling CORS for specific origins
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Default response for unspecified routes
app.get("*", (req, res) => {
    res.status(404).send("404 Error: Page not found.");
});



// Socket.IO handling for chat functionalities
io.on('connection', (socket) => {
  socket.on('join_room', async (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);

    // Fetch chat history and emit to the joined room
    try {
      const messages = await Chatbox.findAll({
        where: {
          [Op.or]: [
            { sender_id: roomId },
            { Receiver_Id: roomId }
          ]
        },
        order: [['createdAt', 'ASC']]
      });
      io.to(roomId).emit('load_messages', messages);
    } catch (error) {
      console.error("Error loading messages for room:", error);
    }
  });
  
  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`User left room: ${roomId}`);
  });
  
  socket.on('send_message', async (data) => {
    const { senderId, receiverId, message } = data;

    try {
      // Save the message to the database
      const chat = await Chatbox.create({ sender_id: senderId, Receiver_Id: receiverId, message });

      // Emit the message to both the sender and the receiver
      io.to(senderId).to(receiverId).emit('receive_message', { senderId, receiverId, message });
      console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
    } catch (error) {
      console.error("Error handling sending message:", error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});


// Start server and synchronize database
sequelize.sync().then(() => {
    server.listen(port, () => {
        console.log(`Server running on http://${hostname}:${port}/`);
    });
});
