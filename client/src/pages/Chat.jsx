import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { socket, onlineUsers } = useSocket();
    const { user } = useAuth();
    const messagesEndRef = useRef(null);

    // Redirect if not logged in
    if(!user) return <Navigate to="/login" />;

    useEffect(() => {
        if(!socket) return;

        socket.on('receive_message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        return () => socket.off('receive_message');
    }, [socket]);

    // Auto scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if(!newMessage.trim() || !socket) return;

        const messageData = {
            text: newMessage,
            senderName: user.name,
            senderId: user.id
        };
        socket.emit('send_message', messageData);
        setNewMessage('');
    };

    const handleKeyPress = (e) => {
        if(e.key === 'Enter') sendMessage();
    };

    return (
        <div className='chat-page'>
            <div className='chat-container'>

                {/* Sidebar - Online Users */}
                <div className='chat-sidebar'>
                    <h3>Online Users ({onlineUsers.length})</h3>
                    <div className='online-users-list'>
                        {onlineUsers.map((u, i) => (
                            <div key={i} className='online-user'>
                                <span className='online-dot'></span>
                                <span>{u.name}</span>
                                {u.id === user.id && (
                                    <span className='you-badge'>(you)</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className='chat-main'>
                    <div className='chat-header'>
                        <h2>💬 Live Chat</h2>
                        <span>{onlineUsers.length} online</span>
                    </div>

                    {/* Messages */}
                    <div className='messages-container'>
                        {messages.length === 0 ? (
                            <p className='no-messages'>
                                No messages yet. Say Hello! 👋
                            </p>
                        ) : (
                            messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`message ${msg.senderId === user.id ? 'own-message' : 'other-message'}`}
                                >
                                    <div className='message-bubble'>
                                        {msg.senderId !== user.id && (
                                            <span className='message-sender'>{msg.senderName}</span>
                                        )}
                                        <p>{msg.text}</p>
                                        <span className='message-time'>
                                            {new Date(msg.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className='chat-input-area'>
                        <input
                            type='text'
                            placeholder='Type a message...'
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;