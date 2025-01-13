import { getCookie } from "./Cookies";
import { format } from "date-fns";
import { apiURL } from "./globals";

//Logic for adding available times
export const handleAddAvailableTime = async (availableTimes, setAvailableTimes, newAvailableTime) => {
  if (newAvailableTime) {
    const formattedDate = format(newAvailableTime, "yyyy-MM-dd HH:mm");
    const availableTime = { date: formattedDate };
    const updatedTimes = [...availableTimes, availableTime];
    setAvailableTimes(updatedTimes);
    updateAvailableTime(updatedTimes);
  }
};

//Logic for removing available time
export const handleRemoveAvailableTime = (timeToRemove, availableTimes, setAvailableTimes) => {

  //Iterating through array, checking times, if condition is true, element will be in a new array, otherwise its not
  const updatedTimes = availableTimes.filter((time) => time.date !== timeToRemove.date);

  setAvailableTimes(updatedTimes);
  updateAvailableTime(updatedTimes);
};

//API call to update times in backend
const updateAvailableTime = async (updatedTimes) => {
  try {
    const response = await fetch(apiURL + "consultant/dates", {
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

//Logic for consultant to approve consultation
export const handleApproveConsultation = async (consultation, setApprovedConsultations, setNotApprovedConsultations) => {
  try {
    const response = await fetch(
      apiURL + `appointments?appointmentId=${consultation.id}`,
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

//Logic for editing and saving consultant's info
export const handleSaveInfo = async (e, editingUser, setErrorMessage, setEditingUser, setShowEditModal, setShowPhotoModal, setPhotoFile) => {
  e.preventDefault();
  try {
    const response = await fetch(apiURL + "consultant/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": getCookie("loggedIn"),
      },
      body: JSON.stringify(editingUser),
    });

    if (!response.ok) {
      const errorData = await response.text();
      setErrorMessage(errorData || "Failed to save user info.");
      return;
    }

    setErrorMessage("User info updated successfully!");
    setEditingUser(null);
    setShowEditModal(false);
    setShowPhotoModal(false);
    setPhotoFile(null);
  } catch (error) {
    console.error("Error saving user info:", error);
    setErrorMessage("An error occurred while saving user info.");
  }
};

//Login for uploading photo to ImgBB and backend
export const handleUploadPhoto = async (e, photoFile, handleCloseModal, user, setUser) => {
    e.preventDefault();
  
    if (!photoFile) {
      alert("Please select a photo to upload.");
      return;
    }
  
    try {
      //Uploading image to ImgBB
      const formData = new FormData();
      formData.append("image", photoFile);
      const API_KEY = "b0a153b4ffa68be3b12a43d068976972";
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (data.success) {
        console.log("Uploaded image URL:", data.data.url);
  
        //Updating image url
        const updatedUser = { ...user, imageUrl: data.data.url };
  
       //Saving updated info to backend
        const saveResponse = await fetch(apiURL + "consultant/edit", {
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
          alert(saveError || "Failed to save updated user.");
        } else {
          setUser(updatedUser);
          setErrorMessage("Photo uploaded and user updated successfully!");
        }
      } else {
        console.error("ImgBB upload failed:", data);
        alert("Photo upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading photo or saving user:", error);
    }
  
    handleCloseModal();
  };
export default handleAddAvailableTime;