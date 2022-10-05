require('dotenv').config();
const { Server } = require('socket.io');
const { httpServer } = require('../app');

const io = new Server(httpServer, {
  // cors: true,
  cors: {
    origin: ['https://wolfon.live', 'https://www.wolfon.live', 'http://localhost:3001'],
    upgrades: ['websocket'],
    pingInterval: 25000,
    pingTimeout: 20000,
  },
});

/**
 * Websocket
 */
io.on('connection', (socket) => {
  // let userRoom;
  console.log(socket.id, 'connected');
  socket.on('join', (room, name) => {
    console.log('join', room, name);
    socket.join(room);
    socket.to(room).emit('viewer', socket.id, name);
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
    console.log(room);
    socket.to(room).emit('ice_candidate', data, socket.id);
    socket.to(room).emit('test', data, socket.id);
  });

  // Version Control
  socket.on('addTag', (tag) => {
    io.emit('addTag', tag);
  });

  // Get Viewer code
  socket.on('getCode', (viewer, streamer) => {
    console.log('server get code');
    io.to(viewer).emit('getCode', streamer);
  });
  socket.on('passCode', (code) => {
    console.log('server pass code');
    io.emit('passCode', code);
  });

  // chat room
  socket.on('chat message', (msg) => {
    io.to(msg.room).emit('chat message', msg);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnect');
    io.emit('leave', socket.id);
  });
});
