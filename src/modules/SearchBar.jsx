import { apiURL } from "./globals";

export const fetchResults = async (date, specialty, category, hourlyRateFrom, hourlyRateTo, hasSearched, results, setResults) => {
    if (hourlyRateFrom && hourlyRateTo && Number(hourlyRateFrom) > Number(hourlyRateTo)) {
      console.error('Hourly Rate "From" should be less than or equal to "To".');
      return;
    }

    const formattedDate = date ? new Date(date).toISOString().split('T')[0] : '';
    const queryParams = new URLSearchParams({
      minPrice: hourlyRateFrom || 0,
      maxPrice: hourlyRateTo || Number.MAX_VALUE,
      speciality: specialty,
      category,
      date: formattedDate,
    }).toString();

    try {
      const response = await fetch(
        apiURL + `consultant/search?${queryParams}`,
        { method: 'GET' }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch results: ${response.status}`);
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };
  export default fetchResults;