$(function(){
    var $loginPage = $('.login.page')
    var $chatPage = $('.chat.page')
    var $enterButton = $('.enter')
    var $chatBox = $('#messages')
    var $messageForm = $('form.send')
    var $messageInput = $('#m')
    var $usersOnline = $('#users')
    var $usersTyping = $('#onlineUsers')
    var username;
    var socket = io();
    var usersTyping = [];

    $('form.name').submit(function(e){
        e.preventDefault()
        setUserName($('#n').val())
    })

    $messageInput.on('input', function(){
        socket.emit('typing')
    })

    function setUserName(name){
        if (!name || name === null){
            alert("invalid username")
        }
        else{
            username = name;
            socket.emit('add user', username)
            socket.emit('request users')
            // $usersOnline.append($('<li>').text(username))
            $loginPage.hide()
            $chatPage.show()
        }
    }

    function updateTyping(){
        $('ul#onlineUsers > li').remove()
        usersTyping.forEach(user => console.log(user))
        usersTyping.forEach(user => $usersTyping.append($('<li>').text(user + " is typing")))
    }

    socket.on('users', function(usernameList){
        $('ul#users > li').remove()
        usernameList.forEach(name => $usersOnline.append($('<li>').text(name)))
    })

    socket.on('user joined', function(username){
        $chatBox.append($('<li>').text(username + ' has joined the chat'))
        socket.emit('request users')
        // $usersOnline.append($('<li>').text(username))
    })

    socket.on('user disconnected', function(username){
        socket.emit('request users')
        $chatBox.append($('<li>').text(username + ' has left the chat'))
        
    })

    socket.on('typing', function(username){
        if (!usersTyping.includes(username) || usersTyping.length === 0){
            usersTyping.push(username)
            updateTyping()
            setTimeout(function (){
                usersTyping.splice(usersTyping.indexOf(username),1)
                updateTyping()
            }, 3000)
        }
    })

    socket.on('message', function(data){
        $chatBox.append($('<li>').text(data.username + ': ' + data.message))
    })

    socket.on('private message', function(data){
        if (username ===  data.recipient){
            $chatBox.append($('<li>').text("(PM) " + data.username + ": " + data.message))
        }
    })

    $messageForm.submit(function(e){
        e.preventDefault()
        var message = $messageInput.val()
        if (message.substring(0,3)==='/pm'){
            splitMessage = message.split(' ')
            recipient = splitMessage[1]        
            msg = message.substring(5+username.length, message.length)
            socket.emit('private message', {recipient:recipient, message:msg})
            $chatBox.append($('<li>').text("PM to " + recipient + ": " + msg))
        }
        else{
            $chatBox.append($('<li>').text(username+': '+message))
            socket.emit('new message', message)
        }
    })

})