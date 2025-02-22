import axios from "axios";
import { store } from "../redux/store";
import { logoutUser } from "../redux/slices/authSlice";

// Helper function to get stored token
const getStoredToken = () => {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return null;
    const parsedToken = JSON.parse(storedToken);
    return parsedToken.accessToken || null; // Ensure we're returning the correct accessToken
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000", // Replace with your API base URL
});

// Request interceptor to attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token || getStoredToken(); // Get token from Redux state or localStorage

    console.log(config); // Log the request to see its details

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Attach token to headers
    }
    return config;
  },
  (error) => Promise.reject(error) // Handle request error
);


// Response interceptor to handle token expiration and other errors
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through the response if it's successful
  (error) => {
    if (error.response && error.response.status === 401) { // Handle unauthorized errors (token expired)
      const originalRequest = error.config;

      // Prevent infinite logout loop by checking if it's already a logout request
      if (originalRequest.url.includes("/logout")) {
        console.warn("Received 401 on logout request. Ignoring.");
        return Promise.reject(error);
      }

      // Dispatch logout action and remove token from localStorage
      store.dispatch(logoutUser());
      localStorage.removeItem("token"); // Ensure token is removed from storage
    }
    return Promise.reject(error); // Reject the promise if error occurs
  }
);

// Authenticated API request helper function
export const authRequest = async (method, url, data = null) => {
  let accessToken = getStoredToken();
  
  if (!accessToken) {
    throw new Error("User not authenticated");
  }

  try {
    const response = await axiosInstance({
      method: method, // GET, POST, etc.
      url: url, // The endpoint URL
      data: data, // The data to send in POST requests
      headers: {
        Authorization: `Bearer ${accessToken}`, // Attach token in headers if it's available
      },
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error making request:", error);
    throw error; // Throw error if request fails
  }
};

// Export axios instance for other API calls
export default axiosInstance;
