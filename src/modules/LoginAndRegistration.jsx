import setCookie, { getCookie } from "./Cookies";
import { apiURL } from "./globals";

export const handleLogin = async (e, state, setState) => {

    const { email, password, role } = state;
    const { setEmail, setPassword, setRole, setResponseMessage, setResponseType, setLoading } = setState;

    e.preventDefault();
    setLoading(true);
    setResponseMessage('');
    setResponseType('');

    const formData = { email, password, role };

    try {
      // Select endpoint based on role
      const endpoint =
        role === 'CONSULTANT'
          ? apiURL + 'auth/login/consultant'
          : apiURL + 'auth/login/client';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await response.text(); // Backend returns a string message

      if (!response.ok) {
        setResponseType('error');
        setResponseMessage(text);
      } else {
        setResponseType('success');
        setResponseMessage('Logged in successfully!');
        setCookie('loggedIn', text);

        // Optionally clear the form on success
        setEmail('');
        setPassword('');
        setRole('CLIENT');
        window.location.href = '/profile';
      }
    } catch (error) {
      setResponseType('error');
      setResponseMessage('An unexpected error occurred. Please try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  export const handleRegister = async (e, state, setState) => {

    const {
            role,
            firstName,
            lastName,
            email,
            phone,
            password,
            confirmPassword,
            birthDate,
            categories,
            speciality,
            description,
            hourlyRate
        } = state;
    const {
            setResponseMessage,
            setResponseType,
            setLoading
          } = setState;

    e.preventDefault();
    setLoading(true);
    setResponseMessage('');
    setResponseType('');

    // Check password match before sending
    if (password !== confirmPassword) {
      setLoading(false);
      setResponseType('error');
      setResponseMessage('Passwords do not match.');
      return;
    }

    const formData = {
      role,
      firstName,
      lastName,
      email,
      phone,
      password,
    };

    if (role === 'CLIENT') {
      formData.birthDate = birthDate;
    } else {
      formData.categories = categories;
      formData.availableTime; // Not used in your code yet, but presumably you’d handle it like availableTimes
      formData.speciality = speciality;
      formData.description = description;
      formData.hourlyRate = hourlyRate;
    }

    try {
      let endpoint = '';
      if (role === 'CONSULTANT') {
        endpoint = apiURL + 'auth/consultant';
      } else {
        endpoint = apiURL + 'auth/client';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await response.text(); // Backend returns a string message

      if (!response.ok) {
        // Error responses (e.g., 400, etc.)
        setResponseType('error');
        setResponseMessage(text);
      } else {
        // Successful response
        setResponseType('success');
        setResponseMessage(text);
        window.location.href = '/login';
      }
    } catch (error) {
      setResponseType('error');
      setResponseMessage('An unexpected error occurred. Please try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  export default handleLogin;