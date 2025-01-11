import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom'; // To get roomCode from the URL

let socket;

const ChatRoom = () => {
    const { roomCode } = useParams(); // Get the roomCode from URL parameters
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Initialize socket connection on component mount
        //socket = io('http://localhost:4000'); // Connect to your Socket.io server
        socket = io('https://coalesce-backend-5uxc.onrender.com');

        // Join the room when the component mounts
        socket.emit('joinRoom', { roomCode });

        // Listen for incoming messages and add them to the state
        socket.on('receiveMessage', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        // Clean up the socket connection when the component is unmounted
        return () => {
            socket.emit('leaveRoom', { roomCode }); // Leave the room when unmounting
            socket.disconnect(); // Disconnect the socket
        };
    }, [roomCode]); // Re-run the effect when the roomCode changes

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit('sendMessage', { roomCode, message }); // Emit the message to the server
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Chat Room: {roomCode}</h2>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatRoom;
