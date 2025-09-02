import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom'; 

let socket;

const ChatRoom = ({userData}) => {
    const { roomCode } = useParams(); // Get the roomCode from URL parameters
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);
    

    useEffect(() => {
        // Initialize socket connection on component mount
        //socket = io('http://localhost:4000'); // Connect to your Socket.io server
        socket = io(process.env.REACT_APP_BACKEND_URL_production);

        // Join the room when the component mounts
        socket.emit('joinRoom', { roomCode });

        //load previous messages 
        socket.on('previousMessages', (msgs) => {
            setMessages(msgs);
        })

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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behaviour: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit('sendMessage', { roomCode, message, sender : userData?.user.firstName || "Guest" }); // Emit the message to the server
            setMessage('');
        }
    };

    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-3 bg-blue-600 text-white font-semibold text-center rounded-t-xl">
          Room: {roomCode}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.sender === userData?.username ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`px-3 py-2 rounded-lg max-w-xs ${
                  msg.sender === userData?.user.firstName 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-200 text-black"
                }`}
              >
                <p className="text-sm font-semibold">{msg.sender}</p>
                <p>{msg.message}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex border-t p-2 bg-white rounded-b-xl">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button 
            onClick={sendMessage} 
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
);

};

export default ChatRoom;
