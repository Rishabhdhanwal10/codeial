module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer, {
        cors: {
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type']
        }
    });

    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected!')
        });

        socket.on('join_room', function(data){
            console.log('joing request received', data);

            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined', data);

            // detects send_message and broadcast to everyone in the room
            socket.on('send_message', function(data){
                io.in(data.chatroom).emit('receive_message', data);
            })
        })

    });

}