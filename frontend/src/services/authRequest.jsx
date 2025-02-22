import axios from "axios";

// Function to get access token from localStorage
const getAccessToken = () => {
  const tokenObj = localStorage.getItem("token"); // Get token object from localStorage
  if (!tokenObj) {
    throw new Error("No access token found. Please log in.");
  }
  
  const parsedTokenObj = JSON.parse(tokenObj); // Parsing the token string if it's stored as JSON
  const token = parsedTokenObj?.accessToken;  // Accessing the accessToken
  
  if (!token) {
    throw new Error("No access token found. Please log in.");
  }
  return token;
};

// Function to refresh access token (you will need to implement your refresh logic on the server)
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token found. Please log in.");
  }

  try {
    const response = await axios.post("/api/auth/refresh-token", { refreshToken });
    const newAccessToken = response.data.accessToken;
    
    // Store new access token
    localStorage.setItem("token", JSON.stringify({ accessToken: newAccessToken }));
    
    return newAccessToken;
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    throw new Error("Unable to refresh access token. Please log in again.");
  }
};

// Function to make authenticated API requests
export const authRequest = async (method, url, data = null) => {
    try {
      let token = getAccessToken(); // Get access token
  
      // Check if the token is expired before making the request
      const isTokenExpired = checkTokenExpiration(token);
  
      // If token is expired, refresh the token
      if (isTokenExpired) {
        console.log("Token expired, refreshing...");
        token = await refreshAccessToken();
      }
  
      const headers = {
        Authorization: `Bearer ${token}`,  // Use the access token
        "Content-Type": "application/json",
      };
  
      console.log("Headers being sent:", headers);  // Log for debugging
  
      // Make the request and log the response
      const response = await axios({
        method,
        url,
        data,
        headers,
      });
  
      console.log("API Response:", response); // Log the full response object for debugging
      return response.data; // Return the response data
    } catch (error) {
      console.error("API Error:", error.message);
      console.error("Error Response:", error.response); // Log the response error for more info
      throw new Error(error.response?.data?.message || error.message || "Request failed.");
    }
  };
  

// Decode JWT and check expiration
const checkTokenExpiration = (token) => {
  try {
    const decodedToken = decodeToken(token);
    const currentTime = Date.now() / 1000; // Current time in seconds
    return decodedToken.exp < currentTime;  // Token expired check
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;  // Assume expired if decoding fails
  }
};

// Decode the JWT token to get its payload
const decodeToken = (token) => {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload;
};
