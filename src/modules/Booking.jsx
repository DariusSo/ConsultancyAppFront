export default async function handleBooking() {
    if (!selectedDate) {
      alert("Please select a valid date and time before booking.");
      return;
    }
  
    try {
      // Prepare the booking payload
      const bookingPayload = {
        title: "Consultation Appointment", // Adjust title dynamically if needed
        description: "Discuss specific issues with the consultant.", // Optional description
        category: consultant.categories, // Assuming `consultant` has a `category` field
        consultantId: consultant.id, // Consultant's ID
        timeAndDate: selectedDate.toISOString(), // Use ISO format for the date
        price: consultant.hourlyRate, // Assuming `hourlyRate` is in the consultant object
      };
  
      // Send the booking request to the backend
      const response = await fetch("http://localhost:8080/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getCookie("loggedIn")
        },
        body: JSON.stringify(bookingPayload),
      });
  
      if (!response.ok) {
        throw new Error("Failed to book the appointment.");
      }
  
      const responseData = await response.json();
      alert(`Appointment successfully booked! ID: ${responseData.id}`);
      setIsModalOpen(false); // Close the modal after successful booking
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to book the appointment. Please try again later.");
    }
  };