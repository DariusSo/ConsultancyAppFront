import { getCookie } from "./Cookies";
import { loadStripe } from "@stripe/stripe-js";

export const handleBooking = async (consultation) => {

    const stripe = await loadStripe("pk_test_51PlEGq2KAAK191iLnqMx4EzwlRUP93zGEFdyBKynSDBAtbQcJTR2TwbWiKYVSHLVWL0kBq7jK3vyWABKrHB8ZvRm00Kd1TqbuX");
    if (!stripe) {
      console.error("Failed to initialize Stripe");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie("loggedIn"),
        },
        body: JSON.stringify(consultation),
      });

      if (!response.ok) {
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
      alert("Failed to book the appointment. Please try again later.");
    }
  };
  export default handleBooking;