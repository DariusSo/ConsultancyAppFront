import { getCookie } from "./Cookies";
import { loadStripe } from "@stripe/stripe-js";
import { apiURL } from "./globals";

//Get available times for datepicker
export const getAvailableTimes = (selectedDate, timeSlotsByDate) => {
  if (!selectedDate) return [];
  const selectedDateKey = selectedDate.toLocaleDateString("en-CA");
  return timeSlotsByDate[selectedDateKey] || [];
};

//Booking logic for appointment
export const handleBooking = async (selectedDate, consultant, setIsAuthModalOpen, problemTitle, problemDescription, setErrorMessage, setIsModalOpen) => {
  if (!selectedDate) {
    alert("Please select a valid date and time before booking.");
    return;
  }

  //Dont let to book an appointment if not logged in
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

  //Preparing booking info for API
  const bookingPayload = {
    title: problemTitle,
    description: problemDescription,
    category: consultant.categories,
    consultantId: consultant.id,
    timeAndDate: formattedDate,
    price: consultant.hourlyRate,
  };

  try {
    const response = await fetch(apiURL + "create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getCookie("loggedIn"),
      },
      body: JSON.stringify(bookingPayload),
    });
    if (response.status === 403) {
      setIsModalOpen(false);
      setErrorMessage("Consultants cant be clients, if you want to register for an appointment, you have to register as a client.");
    } else if (!response.ok) {
        throw new Error("Failed to book the appointment.");
    }

    const session = await response.json();
    const sessionId = session.id;

    //Redirect to stripe checkout
    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      console.error("Stripe Checkout error:", error.message);
    }
  } catch (error) {
    console.error("Booking error:", error);
  }
};

//Open modal for booking an appointment
export const openModal = async ({setIsModalOpen, setSelectedDate, consultant, setAvailableDates, setTimeSlotsByDate}) => {
  try {
    setIsModalOpen(true);
    setSelectedDate(null);

    //API call to get correct dates
    const response = await fetch(apiURL + `consultant/dates?id=${consultant.id}`, {
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

    //Formatting dates for datepicker
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

//Formatting and pushing dates to datepicker from consultants object, now it's not used, but i will leave this here for awhile
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
};

//Formatting to send correct date format to backend, should be a simpler way
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