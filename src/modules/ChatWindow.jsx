import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { getCookie } from "./Cookies";
import { apiURL } from "./globals";

export const connect = (roomUuid, setMessages, stompClientRef, nameRef) => {
    const socketFactory = () => new SockJS(apiURL + "websocket");
    const stompClient = Stomp.over(socketFactory);

    stompClient.connect({}, (frame) => {
      console.log("Connected:", frame);
      stompClient.subscribe(`/topic/consultation/${roomUuid}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log("Received message:", receivedMessage);
        console.log("Current name:", nameRef.current);
        if (receivedMessage.name != nameRef.current) {
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

export const handleSend = (setMessages, setInput, input, stompClientRef, name, roomUuid) => {
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
    sendMessage(input, stompClientRef, name, roomUuid);
    setInput("");
};

export const sendMessage = (newMessage, stompClientRef, name, roomUuid) => {
    const stompClient = stompClientRef.current;
    const chatMessage = {
      name,
      message: newMessage,
      sentAt: new Date().toISOString(),
      messageType: "USER",
    };
    stompClient.send(`/app/consultation/${roomUuid}`, {}, JSON.stringify(chatMessage));
};

export async function getName() {
  const token = getCookie("loggedIn");
  const apiUrl = apiURL + "auth/profile";
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
export default connect;