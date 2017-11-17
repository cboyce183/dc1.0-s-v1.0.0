const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log('A user connected!');

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });

  socket.on('error', function() {
    console.log('An error has occured');
  });

  socket.on('send', function(data) {
    socket.emit('receive', data)
  })
});


http.listen(process.env.PORT || 3000, function(){
  console.log('listening on port:3000');
});
