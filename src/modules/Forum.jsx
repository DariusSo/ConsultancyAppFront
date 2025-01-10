import { getCookie } from "./Cookies";
import { loadStripe } from "@stripe/stripe-js";
import { apiURL } from "./globals";

export const fetchUserProfile = async (setRole, setUserName) => {
    try {
    const response = await fetch(apiURL + 'auth/profile', {
        headers: {
        Authorization: getCookie("loggedIn"),
        },
    });
    if (response.ok) {
        const data = await response.json();
        setRole(data.role);
        setUserName(data.firstName);
    } else {
        console.error('Failed to fetch profile:', response.status);
    }
    } catch (error) {
    console.error('Error fetching user profile:', error);
    }
};

export const fetchConsultantInfo = async (setConsultant, setAvailableTime, id) => {
    try {
    const response = await fetch(apiURL + `consultant/id?id=${id}`, {
        headers: {
        Authorization: getCookie("loggedIn"),
        },
    });

    if (response.ok) {
        const data = await response.json();
        setConsultant(data);
        setAvailableTime(data.availableTime);
    } else {
        console.error('Failed to fetch consultant info:', response.status);
    }
    } catch (error) {
    console.error('Error fetching consultant info:', error);
    }
};

export const fetchForumMessages = async (setQuestions, id) => {
    try {
    const response = await fetch(apiURL + `forum?consultantId=${id}`);
    if (response.ok) {
        const messages = await response.json();
        setQuestions(messages);
    } else {
        console.error('Failed to fetch forum messages:', response.status);
    }
    } catch (error) {
    console.error('Error fetching forum messages:', error);
    }
};

export const handlePostQuestion = async (text, userName, id, setQuestions, setNewQuestion, questions) => {
    if (text.trim() === '') return;

    const forumMessage = {
      name: userName, // Pass the user's name
      question: text,
      answer: null,
      consultantId: id, // Use the consultant ID from URL
    };

    try {
      const response = await fetch(apiURL + 'forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forumMessage),
      });

      if (response.ok) {
        const newQuestionEntry = {
          id: questions.length + 1,
          ...forumMessage,
          questionAsked: new Date().toISOString(),
        };
        setQuestions([...questions, newQuestionEntry]);
        setNewQuestion('');
      } else {
        console.error('Failed to create question:', response.status);
      }
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

export const handleReply = async (messageId, replyText, setQuestions, setReplyText, questions) => {
    if (!replyText[messageId] || replyText[messageId].trim() === '') return;

    try {
      const response = await fetch(apiURL + `forum?messageId=${messageId}&message=${encodeURIComponent(replyText[messageId])}`, {
        method: 'PUT',
        headers: {
          Authorization: getCookie("loggedIn"),
        },
      });

      if (response.ok) {
        setQuestions(
          questions.map((question) =>
            question.id === messageId ? { ...question, answer: replyText[messageId] } : question
          )
        );
        setReplyText({ ...replyText, [messageId]: '' });
      } else {
        console.error('Failed to save answer:', response.status);
      }
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };
  export const handleContinuePayment = async (consultation) => {
      const authToken = getCookie("loggedIn");
      if (!authToken) {
        setIsAuthModalOpen(true);
        return;
      }
  
      const stripe = await loadStripe("pk_test_51PlEGq2KAAK191iLnqMx4EzwlRUP93zGEFdyBKynSDBAtbQcJTR2TwbWiKYVSHLVWL0kBq7jK3vyWABKrHB8ZvRm00Kd1TqbuX");
      if (!stripe) {
        console.error("Failed to initialize Stripe");
        return;
      }

      try {
        const response = await fetch(apiURL + "create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: getCookie("loggedIn"),
          },
          body: JSON.stringify(consultation),
        });
        if (response.status === 403) {
          setIsModalOpen(false);
          setErrorMessage("Consultants cant be clients, if you want to register for an appointment, you have to register as a client.");
        } else if (!response.ok) {
            throw new Error("Failed to book the appointment.");
        }
  
        const session = await response.json();
        const sessionId = session.id;
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error("Stripe Checkout error:", error.message);
        }
      } catch (error) {
        console.error("Booking error:", error);
      }
    };

export default fetchForumMessages;