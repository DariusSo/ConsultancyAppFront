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
  export const handleSaveInfo = async (e, editableUser, setUser, setIsEditing, setErrorMessage) => {
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
        setErrorMessage(errorMessage || "Failed to update user info.");
        return;
      }

      setErrorMessage("User info updated successfully!");
      setUser(editableUser); // Update global user state
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating user info:", error);
      setErrorMessage("An error occurred while updating user info.");
    }
  };

  export const handleUploadPhoto = async (e, photoFile, handleCloseModal, user, setUser, setErrorMessage) => {
    e.preventDefault();
  
    if (!photoFile) {
      alert("Please select a photo to upload.");
      return;
    }
  
    try {
      // Step 1: Upload Photo to ImgBB
      const formData = new FormData();
      formData.append("image", photoFile);
      const API_KEY = "b0a153b4ffa68be3b12a43d068976972"; // Your ImgBB API key
  
      const imgResponse = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
        method: "POST",
        body: formData,
      });
  
      const imgData = await imgResponse.json();
  
      if (!imgData.success) {
        console.error("ImgBB upload failed:", imgData);
        setErrorMessage("Photo upload failed. Please try again.");
        return;
      }
  
      console.log("Uploaded image URL:", imgData.data.url);
  
      // Step 2: Save Updated User to Backend
      const updatedUser = { ...user, imageUrl: imgData.data.url };
  
      const saveResponse = await fetch("http://localhost:8080/client/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getCookie("loggedIn"), // Ensure this utility is defined
        },
        body: JSON.stringify(updatedUser),
      });
  
      if (!saveResponse.ok) {
        const saveError = await saveResponse.text();
        console.error("Error saving user:", saveError);
        setErrorMessage(saveError || "Failed to save updated user.");
        return;
      }
  
      console.log("Backend response:", await saveResponse.text());
      setUser(updatedUser); // Update the user state locally
      setErrorMessage("Photo uploaded and user updated successfully!");
  
    } catch (error) {
      console.error("Error uploading photo or saving user:", error);
      setErrorMessage("An error occurred while uploading the photo or saving user data.");
    } finally {
      handleCloseModal(); // Close modal in all cases
    }
  };
  

  export default handleBooking;