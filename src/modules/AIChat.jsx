import { getCookie } from "./Cookies";
import { apiURL } from "./globals";

//Send message to /ai endpoint and add answer to message list
export const sendMessage = async (consultantCategory, setMessages, setLoading, userMessage, setUserMessage) => {
  
  //Don't send empty message
  if (userMessage.trim() === "") return;

  // Add user's message to the chat
  setMessages((prevMessages) => [
    ...prevMessages,
    { sender: "You", content: userMessage },
  ]);

  // Save current message for async call
  const currentMessage = userMessage;
  setUserMessage("");
  setLoading(true);

  try {
    // API call to fetch AI response
    const token = getCookie("loggedIn");
    const response = await fetch(
      apiURL + `ai?message=${encodeURIComponent(
        currentMessage
      )}&consultantCategory=${encodeURIComponent(consultantCategory)}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch AI response");
    }

    //AI response
    const data = await response.text();

    // Add AI response to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "AI", content: data },
    ]);
  } catch (error) {
    console.error("Error fetching AI response:", error);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "AI", content: "I'm sorry, I couldn't process that. Please try again." },
    ]);
  } finally {
    setLoading(false);
  }
};
export default sendMessage;