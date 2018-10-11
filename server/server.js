const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

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

  socket.emit('newMessage', {
    from: "Mike",
    text: "YOOOOO",
    createdAt: new Date()
  });

  socket.on('createMessage', (newMessage) => {
    console.log(newMessage);
  });

  socket.on('disconnect', () => {
    console.log("Client disconnected");
  })
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
