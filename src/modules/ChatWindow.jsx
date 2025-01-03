import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs.min.js";

export const connect = (roomUuid, setMessages, stompClientRef, nameRef) => {
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
export default connect;