import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { getCookie } from "./Cookies";
import { apiURL } from "./globals";

//Connect to chat
export const connect = (roomUuid, setMessages, stompClientRef, nameRef) => {

  //Websockets connection
  const socketFactory = () => new SockJS(apiURL + "websocket");
  const stompClient = Stomp.over(socketFactory);

  //Stompclient connection to backend and subscribes
  stompClient.connect({}, (frame) => {
    console.log("Connected:", frame);
    stompClient.subscribe(`/topic/consultation/${roomUuid}`, (message) => {
      const receivedMessage = JSON.parse(message.body);

      //Show recieved message only if it's not yours because yours is shown on send
      if (receivedMessage.name != nameRef.current) {

        //Adding message to list
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

//Logic for sending message on button click
export const handleSend = (setMessages, setInput, input, stompClientRef, name, roomUuid) => {
    if (input.trim() === "") return;

    //Add message to list, thats when your messages is shown
    setMessages((prev) => [
      ...prev,
      {
        name: "You",
        message: input,
        sentAt: new Date().toISOString(),
        messageType: "USER",
      },
    ]);

    //Sending message to websockets controller
    sendMessage(input, stompClientRef, name, roomUuid);
    setInput("");
};

//Send message to websockets controller
export const sendMessage = (newMessage, stompClientRef, name, roomUuid) => {
    
  //Preparing message
  const stompClient = stompClientRef.current;
  const chatMessage = {
    name,
    message: newMessage,
    sentAt: new Date().toISOString(),
    messageType: "USER",
  };
  
  //Sending
  stompClient.send(`/app/consultation/${roomUuid}`, {}, JSON.stringify(chatMessage));
};

//API call to get other persons name
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