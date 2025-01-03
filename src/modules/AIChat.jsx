import { getCookie } from "./Cookies";

export const sendMessage = async (consultantCategory, setMessages, setLoading, userMessage, setUserMessage) => {
    if (userMessage.trim() === "") return;

    // Add user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "You", content: userMessage },
    ]);

    const currentMessage = userMessage; // Save current message for async call
    setUserMessage("");
    setLoading(true);

    try {
      // API call to fetch AI response
      const token = getCookie("loggedIn"); // Replace with your actual cookie name
      const response = await fetch(
        `http://localhost:8080/ai?message=${encodeURIComponent(
          currentMessage
        )}&consultantCategory=${encodeURIComponent(consultantCategory)}`, // Use category from URL
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

      const data = await response.text(); // Assuming the response is plain text

      // Add AI's response to the chat
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