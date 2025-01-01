import { Stomp } from "@stomp/stompjs";
import React, { useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { getCookie } from "../modules/Cookies";

const ChatWindow = forwardRef((props, ref) => {
  const params = useParams();
  const roomUuid = params.id;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const nameRef = useRef("");

  useEffect(() => {
    const fetchName = async () => {
      try {
        const user = await getName();
        setName(user.firstName);
        nameRef.current = user.firstName;
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchName();
  }, []);

  const connect = () => {
    const socket = new SockJS("http://localhost:8080/websocket");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
      console.log("Connected:", frame);
      stompClient.subscribe(`/topic/consultation/${roomUuid}`, (message) => {
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
      stompClientRef.current = stompClient;
    });
  };

  // Expose the connect function to the parent
  useImperativeHandle(ref, () => ({
      connectToChat: connect,
    }));

  const sendMessage = (newMessage) => {
    const stompClient = stompClientRef.current;
    const chatMessage = {
      name,
      message: newMessage,
      sentAt: new Date().toISOString(),
      messageType: "USER",
    };
    stompClient.send(`/app/consultation/${roomUuid}`, {}, JSON.stringify(chatMessage));
  };

  const handleSend = () => {
    if (input.trim() === "") return;

    setMessages((prev) => [
      ...prev,
      {
        name: "You",
        message: input,
        sentAt: new Date().toISOString(),
        messageType: "USER",
      },
    ]);
    sendMessage(input);
    setInput("");
  };

  return (
    <div
      className="
        w-full
        h-full
        flex flex-col
        bg-[#2F3136]
        border-t md:border-t-0 md:border-l border-gray-700
      "
    >
      {/* Top Bar */}
      <div className="p-3 bg-[#34373C] text-lg font-semibold border-b border-gray-700">
        Chat with Consultant
      </div>
  
      {/* Chat Message List */}
      <div className="flex-1 p-3 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${msg.name === "You" ? "justify-end" : "justify-start"}`}
          >
            {/* Message Bubble */}
            <div className="max-w-xs p-3 rounded-lg bg-[#3A3C40] shadow-md">
              <p className="font-bold">{msg.name}</p>
              <p>{msg.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(msg.sentAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
  
      {/* Input Area */}
      <div className="p-3 flex items-center bg-[#34373C] border-t border-gray-700">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="
            flex-1
            px-4 py-2 border border-gray-600 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]
            bg-[#3A3C40] text-gray-200 placeholder-gray-400
          "
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
  
  
});

// Helper function to fetch user name
async function getName() {
  const token = getCookie("loggedIn");
  const apiUrl = "http://localhost:8080/auth/profile";

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export default ChatWindow;
