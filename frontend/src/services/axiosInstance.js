import axios from "axios";
import { store } from "../redux/store"; // Import the store
import { logoutUser } from "../redux/slices/authSlice";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "'http://127.0.0.1:8000/user'", // Set your API base URL here
});

// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState(); // Get current Redux state
    const token = state.auth.token || JSON.parse(localStorage.getItem("token"));

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle expired token (logout)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logoutUser());
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
