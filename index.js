  const express = require('express'); // Importing Express library
const http = require('http'); // Importing HTTP module
const socketIo = require('socket.io'); // Importing Socket.IO library
const cors = require('cors'); // Importing CORS library

const app = express(); // Creating an Express application
app.use(cors()); // Using CORS middleware to allow cross-origin requests

const server = http.createServer(app); // Creating an HTTP server using the Express app

const io = socketIo(server, { // Creating a Socket.IO instance with CORS configuration
  cors: {
    origin: "*", // Allowing all origins
    methods: ["GET", "POST"] // Allowing only GET and POST requests
  }
});

const users = {}; // Object to store users connected to the server
io.on('connection', socket => { // Handling socket connection events
    socket.on('new-user-joined', name => { // Event listener for new user joining
        console.log("New user", name); // Logging new user's name to the console
        users[socket.id] = name; // Storing user's name with their socket ID
        socket.broadcast.emit('user-joined', name); // Broadcasting user join event to other clients
    });

    socket.on('send', message => { // Event listener for sending messages
        socket.broadcast.emit('receive', {name: users[socket.id], message: message }); // Broadcasting received message to other clients
    });

    socket.on('disconnect', message => { // Event listener for user disconnection
       socket.broadcast.emit('left', users[socket.id]); // Broadcasting user leave event to other clients
       delete users[socket.id]; // Removing user from the users object
    });
});

const PORT = 5500; // Port on which the server will run
server.listen(PORT, () => { // Listening for incoming connections on the specified port
    console.log(`Server is running on port ${PORT}`); // Logging server start message
});
