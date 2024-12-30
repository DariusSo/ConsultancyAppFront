import { Stomp } from '@stomp/stompjs';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client/dist/sockjs.min.js';
import { getCookie } from '../modules/Cookies';

const ChatWindow = () => {
  const params = useParams();
  const roomUuid = params.id;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const nameRef = useRef('');

  useEffect(() => {
    const fetchName = async () => {
      try {
        const user = await getName();
        setName(user.firstName);
        nameRef.current = user.firstName;
        console.log(user.firstName);
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    fetchName();
  }, []);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/websocket');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame);

      if (!subscriptionRef.current) {
        subscriptionRef.current = stompClient.subscribe(`/topic/consultation/${roomUuid}`, (message) => {
          const receivedMessage = JSON.parse(message.body);

          if (receivedMessage.name !== nameRef.current) {
            setMessages((prev) => [
              ...prev,
              {
                name: receivedMessage.name,
                message: receivedMessage.message,
                sentAt: receivedMessage.sentAt,
                messageType: receivedMessage.messageType,
              },
            ]);
          }
        });
      }

      stompClientRef.current = stompClient;
    });

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect(() => console.log('Disconnected'));
      }
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [roomUuid]);

  const sendMessage = (newMessage) => {
    const stompClient = stompClientRef.current;

    if (stompClient && stompClient.connected) {
      const chatMessage = {
        name,
        message: newMessage,
        sentAt: new Date().toISOString(),
        messageType: 'USER',
      };

      stompClient.send(`/app/consultation/${roomUuid}`, {}, JSON.stringify(chatMessage));
    } else {
      console.error('Cannot send message: WebSocket is not connected.');
    }
  };

  const handleSend = () => {
    if (input.trim() === '') return;

    setMessages((prev) => [
      ...prev,
      {
        name: 'You',
        message: input,
        sentAt: new Date().toISOString(),
        messageType: 'USER',
      },
    ]);
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 bg-blue-600 text-white text-lg font-semibold">Chat with Consultant</div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${msg.name === 'You' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="max-w-xs p-3 rounded-lg bg-white shadow-md">
              <p className="font-bold">{msg.name}</p>
              <p>{msg.message}</p>
              <p className="text-xs text-gray-500">
                {new Date(msg.sentAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
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

async function getName() {
  const token = getCookie('loggedIn');
  const apiUrl = 'http://localhost:8080/auth/profile';

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export default ChatWindow;
