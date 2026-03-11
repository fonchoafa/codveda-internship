const onlineUsers = new Map();

const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected: ${socket.id}');
    
        //User join with their info
        socket.on('user_join', (userData) => {
            onlineUsers.set(socket.id, userData);
            console.log(`${userData.name} joined the chat`);

            io.emit('online_users', Array.from(onlineUsers.values()));
            io.emit('receive_notification',{
                type: 'join',
                message: `${userData.name} joined the chat`,
                timestamp: new Date()
            });
        });

        //Handle chat message
        socket.on('send_message', (messageData) => {
            console.log('Message received:', messageData);
            io.emit('receive_message', {
                ...messageData,
                timestamp: new Date()
            });
        });

        //Handle disconnect
        socket.on('disconnect', () => {
            const user = onlineUsers.get(socket.id);
            if(user){
                onlineUsers.delete(socket.id);
                io.emit('online_users', Array.from(onlineUsers.values()));
                io.emit('receive_notification', {
                    type: 'leave',
                    message: `${user.name} left the chat`,
                    timestamp: new Date() 
                });
            }
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

module.exports = socketHandler;