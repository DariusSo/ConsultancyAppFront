import { getCookie } from "./Cookies";
import { loadStripe } from "@stripe/stripe-js";
import { apiURL } from "./globals";

//Logic for booking appointments on click
export const handleBooking = async (consultation) => {

  //Stripe
  const stripe = await loadStripe("pk_test_51PlEGq2KAAK191iLnqMx4EzwlRUP93zGEFdyBKynSDBAtbQcJTR2TwbWiKYVSHLVWL0kBq7jK3vyWABKrHB8ZvRm00Kd1TqbuX");
  if (!stripe) {
    console.error("Failed to initialize Stripe");
    return;
  }

  try {
    //Sending data to backend
    const response = await fetch(apiURL + "create-checkout-session", {
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

    //Redirecting to stripe checkout page
    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      console.error("Stripe Checkout error:", error.message);
    }
  } catch (error) {
    console.error("Booking error:", error);
    alert("Failed to book the appointment. Please try again later.");
  }
};

//Method for editing users profile
export const handleSaveInfo = async (e, editableUser, setUser, setIsEditing, setErrorMessage) => {
  e.preventDefault();

  try {
    const response = await fetch(apiURL + "client/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": getCookie("loggedIn"),
      },
      body: JSON.stringify(editableUser),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      setErrorMessage(errorMessage || "Failed to update user info.");
      return;
    }

    setErrorMessage("User info updated successfully!");
    setUser(editableUser);
    setIsEditing(false);
  } catch (error) {
    console.error("Error updating user info:", error);
    setErrorMessage("An error occurred while updating user info.");
  }
};

//Method for uploading and editing users photo
export const handleUploadPhoto = async (e, photoFile, handleCloseModal, user, setUser, setErrorMessage) => {
  e.preventDefault();

  if (!photoFile) {
    alert("Please select a photo to upload.");
    return;
  }

  try {
    //Uploading photo to ImgBB
    const formData = new FormData();
    formData.append("image", photoFile);
    const API_KEY = "b0a153b4ffa68be3b12a43d068976972"; // I think i should store this somewhere else

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

    //Set user photo
    const updatedUser = { ...user, imageUrl: imgData.data.url };

    //Send whole user to backend
    const saveResponse = await fetch(apiURL + "client/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": getCookie("loggedIn"),
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
    setUser(updatedUser);
    setErrorMessage("Photo uploaded and user updated successfully!");

  } catch (error) {
    console.error("Error uploading photo or saving user:", error);
    setErrorMessage("An error occurred while uploading the photo or saving user data.");
  } finally {
    handleCloseModal();
  }
};


export default handleBooking;