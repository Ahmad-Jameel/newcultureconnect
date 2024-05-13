const http = require("http");
const socketIo = require("socket.io");
const port2 = 8000;
const hostname = "127.0.0.1";

const port = 5000;
const path = require("path");
const sequelizee = require("./config");
const adminroute = require('./routes/admin.routes');
const userroute = require('./routes/user.routes')
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors= require('cors');
const DB = require("./models/chatbox.model")

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST", "PUT"]
  }
});


const adminNamespace = io.of('/admin');
const userNamespace = io.of('/user');


userNamespace.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('connectionEstablished', { message: 'Connection successfully established with the server!' });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  
  sequelizee.sync().then(() => {
    server.listen(port2, hostname, () => {
      console.log(`Server running at http://${hostname}:${port2}/`);
    });
  });


  let chatMessages = [];


userNamespace.on('connection', (socket) => {
    console.log('A user connected');

    socket.emit('oldChats', chatMessages);

    socket.on('sendChat', (message) => {
        chatMessages.push(message);
        
        userNamespace.emit('newChat', message);
    });

    socket.on('deleteChat', (messageId) => {
        chatMessages = chatMessages.filter(message => message.id !== messageId);

        userNamespace.emit('chatDeleted', messageId);
    });

    socket.on('updateChat', (updatedMessage) => {
        const index = chatMessages.findIndex(message => message.id === updatedMessage.id);
        if(index !== -1) {
            chatMessages[index] = updatedMessage;

            userNamespace.emit('chatUpdated', updatedMessage);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

