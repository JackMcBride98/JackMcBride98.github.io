var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const path = require('path');

// app.get('/',function(req, res){
//     res.sendFile(path.join(__dirname, '/index.html'));
// });

app.use(express.static(__dirname))

var userCount = 0;
var usernames = [];
var sockets = [];


io.on('connection', function(socket){
    var addedUser = false;

    socket.on('add user', function(username){
        if(!addedUser){
            socket.username = username;
            usernames.push(username)
            userCount++;
            addedUser = true;
            socket.broadcast.emit('user joined', username)
        }
    })

    socket.on('new message', function(data){
        socket.broadcast.emit('message',{username: socket.username, message: data})
    })

    socket.on('disconnect',function(username){
        usernames.splice(usernames.indexOf(socket.username),1)
        socket.broadcast.emit('user disconnected',socket.username);
        console.log(socket.username + " disconnected")
    })

    socket.on('request users',function(){
        socket.emit('users',usernames)
    })

    socket.on('typing', function(){
        socket.broadcast.emit('typing', socket.username)
    })
    
    socket.on('private message', function(data){
        socket.broadcast.emit('private message', {username:socket.username, recipient:data.recipient, message:data.message})
    })
})

http.listen(3000, function (){
    console.log('listening on *:3000')
});