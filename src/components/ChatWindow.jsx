// ChatWindow.js
import React, { useState } from 'react';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;

    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setInput('');

    // Simulating bot response
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Thank you for your message!' }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white text-lg font-semibold">Chat with Consultant</div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg text-white ${
                msg.sender === 'user' ? 'bg-blue-500' : 'bg-gray-400'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white flex items-center border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

var stompClient = null;
function connect(setIsConnected, name, chatWindowRef, users, setUsers, usr, setMessages, messages, msg, hasResponded, setHasResponded) {
  var socket = new SockJS('http://localhost:8080/websocket');
    
  stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
        
  console.log('Connected: ' + frame);

    stompClient.subscribe('/topic/consultation/', function (messageList) {
      
    });
});
}

export default ChatWindow;
