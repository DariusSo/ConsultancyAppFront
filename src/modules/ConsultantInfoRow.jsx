import { getCookie } from "./Cookies";
import { loadStripe } from "@stripe/stripe-js";

export const getAvailableTimes = (selectedDate, timeSlotsByDate) => {
    if (!selectedDate) return [];
    const selectedDateKey = selectedDate.toLocaleDateString("en-CA");
    return timeSlotsByDate[selectedDateKey] || [];
  };

export const handleBooking = async (selectedDate, consultant, setIsAuthModalOpen, problemTitle, problemDescription) => {
    if (!selectedDate) {
      alert("Please select a valid date and time before booking.");
      return;
    }

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

    const formattedDate = formatDateForBackend(selectedDate);
    const bookingPayload = {
      title: problemTitle,
      description: problemDescription,
      category: consultant.categories,
      consultantId: consultant.id,
      timeAndDate: formattedDate,
      price: consultant.hourlyRate,
    };

    try {
      const response = await fetch("http://localhost:8080/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie("loggedIn"),
        },
        body: JSON.stringify(bookingPayload),
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

  export const openModal = async ({setIsModalOpen, setSelectedDate, consultant, setAvailableDates, setTimeSlotsByDate}) => {
    try {
      setIsModalOpen(true);
      setSelectedDate(null);

      const response = await fetch(`http://localhost:8080/consultant/dates?id=${consultant.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie("loggedIn"),
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch available dates.");
      }
      const availableTimesFromApi = await response.json();
      const dateMap = {};
      availableTimesFromApi.forEach(({ date }) => {
        const [datePart, timePart] = date.split(" ");
        if (!dateMap[datePart]) {
          dateMap[datePart] = [];
        }
        dateMap[datePart].push(`${datePart}T${timePart}`);
      });
      setAvailableDates(Object.keys(dateMap).map((d) => new Date(d)));
      setTimeSlotsByDate(dateMap);
    } catch (error) {
      console.error("Error fetching available dates:", error);
    }
  };
  export const pushAvailableTimesToDatePicker = (availableTime, setAvailableDates, setTimeSlotsByDate) => {
    if (!availableTime) return;
    try {
      const parsedAvailableTime = JSON.parse(availableTime || "[]");
      const dateMap = {};

      parsedAvailableTime.forEach(({ date }) => {
        const [datePart, timePart] = date.split(" ");
        if (!dateMap[datePart]) {
          dateMap[datePart] = [];
        }
        dateMap[datePart].push(new Date(`${datePart}T${timePart}`));
      });
      setAvailableDates(Object.keys(dateMap).map((dt) => new Date(dt)));
      setTimeSlotsByDate(dateMap);
    } catch (error) {
      console.error("Error parsing available times:", error);
    }
  }
  const formatDateForBackend = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
  
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };
  export default handleBooking;