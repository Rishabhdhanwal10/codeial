
class ChatEngine{
    constructor(chatBoxId, userEmail, userName){
        this.chatBoxId = (`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.userName = userName;

        this.socket = io.connect('http://localhost:3156');

        if(userEmail){
            this.connectionHandle();
        }
    }

    connectionHandle(){

        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');

            self.socket.emit('join_room', {
                userEmail: self.userEmail,
                chatroom: 'codeial'
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined!', data);
            })

        });

        // send a message on clicking the send message button
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();
            console.log(msg);
            console.log(self.userEmail);

            if(msg != ' '){
                self.socket.emit('send_message', {
                    message: msg,
                    user: self.userName,
                    user_Email: self.userEmail,
                    chatroom: 'codeial'
                })
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);

            let newMessage = $('<li>');

            let messageType = 'other-message';

            if(data.user_Email == self.userEmail){
                messageType = 'self-message';
            }

            newMessage.append(`<span> ${data.message} </span>`);

            newMessage.append(`<sub> ${data.user} </sub>`);

            newMessage.addClass(messageType);

            // console.log(newMessage[0]);

            $('#chat-messages-list').append(newMessage);

        })

    }

}