
import React, { useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import { useParams } from "react-router-dom";
import { connect, getName, handleSend } from "../modules/ChatWindow";

const ChatWindow = forwardRef((props, ref) => {
  const params = useParams();
  const roomUuid = params.id;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const stompClientRef = useRef(null);
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

  useImperativeHandle(ref, () => ({
      connectToChat: () => connect(roomUuid, setMessages, stompClientRef, nameRef),
  }));

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
            <div className="flex items-start mb-4 space-x-3">
              <div className="flex flex-col">
                <div className={`rounded-lg p-3 shadow-md ${msg.name === "You" ? "justify-end bg-[#202122]" : "bg-[#3A3C40]"}`}>
                  <div className="flex items-center text-gray-500 text-xs mb-1">
                    <span>{msg.name}</span>
                    <span className="ml-2">{new Date(msg.sentAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-300">{msg.message}</p>
                </div>
              </div>
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
          onClick={() => handleSend(setMessages, setInput, input, stompClientRef, name, roomUuid)}
          className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
});

export default ChatWindow;
