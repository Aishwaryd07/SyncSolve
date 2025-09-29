import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import 'tailwindcss/tailwind.css';

const Home = () => {
  const navigate = useNavigate();

  const handleJoinRoom = () =>{
    if( !localStorage.getItem('token') ){
      alert('Please LogIn');
      return;
    }
    navigate('/join-room');
  }
  const handleCreateRoom = () =>{
    if( !localStorage.getItem('token') ){
      alert('Please LogIn');
      return;
    }
    navigate("/create-room");
  }

  const handleOpenCodeEditor = () => {
    window.location.href = "https://code-editor-eimx.onrender.com";
  }
  

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center px-4">
    <div className="text-center mb-12 max-w-4xl">
      <h1 className="text-5xl font-bold mb-6 mt-6 py-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
        Welcome to SyncSolve
      </h1>
      <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
        Where questions ignite meaningful conversations, conversations evolve into solutions, and collaboration fuels progress — all in one seamless, secure space.
      </p>
    </div>

    <div className="flex flex-wrap gap-4 mb-16 justify-center">
      <button 
        onClick={handleJoinRoom} 
        className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
      >
        Join Room
      </button>
      
      <button 
        onClick={handleCreateRoom} 
        className="bg-green-600 hover:bg-green-700 text-white py-4 px-8 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
      >
        Create Room
      </button>
      
      <button 
        onClick={handleOpenCodeEditor} 
        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 px-8 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold font-mono"
      >
        Start Coding
      </button>
    </div>

    <div className="w-full max-w-6xl bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 mb-12">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Powerful Features</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-md transition-shadow duration-300">
          <div className="w-12 h-12 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold">UI</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Easy Interface</h3>
          <p className="text-gray-600 text-sm">Intuitive design that gets you started in seconds</p>
        </div>
        
        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-md transition-shadow duration-300">
          <div className="w-12 h-12 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold">💬</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Real-time Chat</h3>
          <p className="text-gray-600 text-sm">Instant messaging with lightning-fast sync</p>
        </div>
        
        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-md transition-shadow duration-300">
          <div className="w-12 h-12 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold">🔒</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Secure Rooms</h3>
          <p className="text-gray-600 text-sm">Private and encrypted conversations</p>
        </div>
        
        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-md transition-shadow duration-300">
          <div className="w-12 h-12 bg-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold">⚡</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Live Coding</h3>
          <p className="text-gray-600 text-sm">Collaborative code editor with preview</p>
        </div>
      </div>
    </div>

    <div className="w-full max-w-4xl bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-2xl shadow-xl text-white">
      <h2 className="text-3xl font-bold mb-8 text-center">What Our Users Say</h2>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="text-2xl text-yellow-400">⭐</span>
          ))}
        </div>
        <blockquote className="text-lg text-gray-300 mb-6 italic leading-relaxed max-w-2xl mx-auto">
          "SyncSolve has revolutionized how our team collaborates. The seamless integration of chat, 
          code editing, and secure rooms makes it incredibly easy to stay connected and productive. 
          It's become an essential tool for our daily workflow."
        </blockquote>
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
            <span className="text-white font-bold">RG</span>
          </div>
          <div className="text-left">
            <p className="font-semibold text-white">Rohan Gupta</p>
            <p className="text-gray-400 text-sm">Tech Lead, Innovation Labs</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default Home;
