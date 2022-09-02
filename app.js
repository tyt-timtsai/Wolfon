require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http');

const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
  cors: true,
});

const { SERVER_PORT, API_VERSION } = process.env;

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/**
 * Websocket
 */
io.on('connection', (socket) => {
  let userRoom;
  console.log(socket.id, 'connected');
  socket.on('join', (room) => {
    userRoom = room;
    socket.join(room);
  });

  // Transport Offer
  socket.on('offer', (room, desc) => {
    socket.to(room).emit('offer', desc, socket.id);
  });

  // Transport Answer
  socket.on('answer', (room, desc) => {
    socket.to(room).emit('answer', desc);
  });

  // Exchange ice candidate
  socket.on('ice_candidate', (room, data) => {
    socket.to(room).emit('ice_candidate', data, socket.id);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(userRoom, socket.id, 'disconnect');
    socket.to(userRoom).emit('bye', socket.id);
  });
});

/**
 * API routes
 */

// Passing websocket to router
app.use((req, res, next) => {
  req.io = io;
  next();
});

const liveRoute = require('./routes/live');

app.use(`/api/${API_VERSION}/live`, liveRoute);

// Page not found
app.use((req, res, next) => {
  res.status(404).sendFile(`${__dirname}/public/404.html`);
});

// Error handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

server.listen(SERVER_PORT, () => {
  console.log('Server listening on port : ', SERVER_PORT);
});
