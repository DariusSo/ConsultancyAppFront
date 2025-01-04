import { getCookie } from "./Cookies";
import { format } from "date-fns"; // Install date-fns for easier date formatting

export const handleAddAvailableTime = async (availableTimes, setAvailableTimes, newAvailableTime) => {
    if (newAvailableTime) {
      const formattedDate = format(newAvailableTime, "yyyy-MM-dd HH:mm");
      const availableTime = { date: formattedDate }; // Customize time range as needed
      const updatedTimes = [...availableTimes, availableTime]; // Create the updated list
      setAvailableTimes(updatedTimes); // Update the state
      console.log("Updated Times:", updatedTimes); // Log the updated list
      updateAvailableTime(updatedTimes);

    }
  };

export const handleRemoveAvailableTime = (timeToRemove, availableTimes, setAvailableTimes) => {

    const updatedTimes = availableTimes.filter((time) => time.date !== timeToRemove.date);

    setAvailableTimes(updatedTimes);
    updateAvailableTime(updatedTimes);
  };

  const updateAvailableTime = async (updatedTimes) => {
    try {
      const response = await fetch("http://localhost:8080/consultant/dates", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie("loggedIn"),
        },
        body: JSON.stringify(updatedTimes),
      });
      const data = await response.text();
    } catch (err) {
      console.error("Failed to update dates:", err);
    }
  }

export const handleApproveConsultation = async (consultation, setApprovedConsultations, setNotApprovedConsultations) => {
    try {
      const response = await fetch(
        `http://localhost:8080/appointments?appointmentId=${consultation.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: getCookie("loggedIn"),
          },
        }
      );
  
      if (response.ok) {
        // Move the consultation to the approved list
        setApprovedConsultations((prevApproved) => [...prevApproved, consultation]);
        setNotApprovedConsultations((prevNotApproved) =>
          prevNotApproved.filter((c) => c.id !== consultation.id)
        );
      } else {
        console.error("Failed to approve consultation:", await response.text());
      }
    } catch (err) {
      console.error("Error approving consultation:", err);
    }
  };

  export const handleSaveInfo = async (e, editingUser, setErrorMessage, setEditingUser, setShowEditModal, setShowPhotoModal, setPhotoFile) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/consultant/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getCookie("loggedIn"), // Replace with your actual function
        },
        body: JSON.stringify(editingUser), // Submit updated user data
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        setErrorMessage(errorData || "Failed to save user info.");
        return;
      }
  
      setErrorMessage("User info updated successfully!");
      setEditingUser(null); // Clear temporary state
      setShowEditModal(false);
      setShowPhotoModal(false); // Close the photo modal as well
      setPhotoFile(null); // Clear the selected photo file // Close modal
    } catch (error) {
      console.error("Error saving user info:", error);
      setErrorMessage("An error occurred while saving user info.");
    }
  };

  export const handleUploadPhoto = async (e, photoFile, handleCloseModal, user, setUser) => {
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
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
          method: "POST",
          body: formData,
        });
    
        const data = await response.json();
        if (data.success) {
          console.log("Uploaded image URL:", data.data.url);
    
          // Update user.imageUrl locally
          const updatedUser = { ...user, imageUrl: data.data.url };
    
          // Step 2: Save Updated User to Backend
          const saveResponse = await fetch("http://localhost:8080/consultant/edit", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": getCookie("loggedIn"),
            },
            body: JSON.stringify(updatedUser),
          });
    
          if (!saveResponse.ok) {
            const saveError = await saveResponse.text(); // Read as plain text
            console.error("Error saving user:", saveError);
            alert(saveError || "Failed to save updated user.");
          } else {
            console.log("Backend response:", await saveResponse.text());
            setUser(updatedUser); // Update the user state locally
            alert("Photo uploaded and user updated successfully!");
          }
        } else {
          console.error("ImgBB upload failed:", data);
          alert("Photo upload failed. Please try again.");
        }
      } catch (error) {
        console.error("Error uploading photo or saving user:", error);
        alert("An error occurred while uploading the photo or saving user data.");
      }
    
      handleCloseModal();
    };
  export default handleAddAvailableTime;