const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const {generateMessage, generateLocationMessage} = require('./utils/message');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath))
//
// app.get('/', (req,res) => {
//   res.sendFile(publicPath + '/index.html')
// });

io.on('connection', (socket) => {
  console.log('New User Connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat!'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user'));

  socket.on('createMessage', (newMessage, callback) => {
    console.log(newMessage);
    io.emit('newMessage', generateMessage(newMessage.from, newMessage.text));
    callback();

  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('User', coords.latitude, coords.longitude))
  });

  socket.on('disconnect', () => {
    console.log("Client disconnected");
  })
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
