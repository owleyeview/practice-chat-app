// Filename: server/app.js
/* 
  This is the main entry point of our server application. 
  It will create an Express-based HTTP server and attach Socket.io to it.
  It will also log a message whenever a client connects or disconnects from 
  the application.
*/

// imports
const express = require('express');  // Express web server framework
const http = require('http');  // Node's native HTTP server module
const socketIO = require('socket.io');  // Socket.io library

// initialize a new instance of Express
const app = express();  
// create a new HTTP server instance for Socket.io to piggyback on
const server = http.createServer(app);  
// initialize a new instance of socket.io by passing the HTTP server object

const io = socketIO(server, {
    // setting cors configuration to allow connections from all origins
    // (this is needed because the client and server are running on different ports,
    // but is NOT SAFE FOR PRODUCTION)
    cors: {
        origin: '*',
    }
});

// listen for incoming connections from clients
io.on('connection', (socket) => {
  console.log('user connected');
  
  // handling chat messages
  // listen for chat message events from clients
  socket.on('chat message', (msg) => {
    // broadcast the message to all other clients
    socket.broadcast.emit('chat message', msg);
  });

  // listen for socket to disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// start the HTTP server and listen on port 3000
// when the server starts listening, the callback function is executed
server.listen(3000, () => {  
  console.log('listening on *:3000');
});
