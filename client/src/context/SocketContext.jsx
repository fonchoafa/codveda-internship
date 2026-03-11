import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext({
  socket: null,
  onlineUsers: [],
  notifications: []
});

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if(user) {
            // Connect to socket server
            const newSocket = io('http://localhost:5000');
            setSocket(newSocket);

            // Join chat with user info
            newSocket.emit('user_join', { name: user.name, id: user.id });

            // Listen for online users updates
            newSocket.on('online_users', (users) => {
                setOnlineUsers(users);
            });

            // Listen for notifications
            newSocket.on('receive_notification', (notification) => {
                setNotifications(prev => [notification, ...prev].slice(0, 10));
            });

            return () => newSocket.disconnect();
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers, notifications }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);