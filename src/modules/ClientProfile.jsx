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
  export const handleSaveInfo = async (e, editableUser, setUser, setIsEditing) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/client/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getCookie("loggedIn"), // Replace with your actual function
        },
        body: JSON.stringify(editableUser),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        alert(errorMessage || "Failed to update user info.");
        return;
      }

      alert("User info updated successfully!");
      setUser(editableUser); // Update global user state
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating user info:", error);
      alert("An error occurred while updating user info.");
    }
  };
  export default handleBooking;