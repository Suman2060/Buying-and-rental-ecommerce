import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";

export const API_URLS = {
  register: "http://127.0.0.1:8000/user/register/",
  login: "http://127.0.0.1:8000/user/login/",
  profile: "http://127.0.0.1:8000/user/profile/",
  changePassword: "http://127.0.0.1:8000/user/change-password/",
  logout: "http://127.0.0.1:8000/user/logout/",
  cart: "http://127.0.0.1:8000/api/cart/",  // Correct URL for viewing cart
  addItemToCart: "http://127.0.0.1:8000/api/cart/add/",  // Correct URL for adding to cart
  updateCartItem: "http://127.0.0.1:8000/api/cart/update/",  // Correct URL for updating cart item
  removeCartItem: "http://127.0.0.1:8000/api/cart/remove/",  // Correct URL for removing from cart
  checkout: "http://127.0.0.1:8000/api/checkout/",  // Correct URL for checkout
  viewCart: "http://127.0.0.1:8000/api/cart/view/",  // corrected URL for viewing cart
};


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

// User Registration
export const registerUser = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(API_URLS.register, userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Registration failed.");
  }
});

// User Login
export const loginUser = createAsyncThunk("auth/login", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(API_URLS.login, userData);
    const { accessToken, refreshToken } = response.data;

    if (!accessToken || !refreshToken) {
      throw new Error("Invalid token received from server.");
    }

    localStorage.setItem("token", JSON.stringify({ accessToken, refreshToken })); // Store both tokens in localStorage
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed.");
  }
});

// Fetch User Profile
export const getUserProfile = createAsyncThunk("auth/profile", async (_, { rejectWithValue }) => {
  try {
    const token = getStoredToken();
    if (!token) throw new Error("No authentication token found.");

    const response = await axiosInstance.get(API_URLS.profile, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch profile.");
  }
});

// Change Password
export const changePassword = createAsyncThunk("auth/changePassword", async (passwordData, { rejectWithValue }) => {
  try {
    const token = getStoredToken();
    if (!token) throw new Error("No authentication token found.");

    const response = await axiosInstance.post(API_URLS.changePassword, passwordData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Password change failed.");
  }
});

// User Logout (Ensuring token clears immediately)
export const logoutUser = createAsyncThunk("auth/logout", async (_, { dispatch, rejectWithValue }) => {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      return rejectWithValue("No token found.");
    }

    const refreshToken = JSON.parse(storedToken).refreshToken;

    if (!refreshToken) {
      return rejectWithValue("Refresh token not found.");
    }

    const response = await axiosInstance.post(API_URLS.logout, {
      refresh_token: refreshToken,
    });

    dispatch(clearState()); // Clear Redux state
    localStorage.removeItem("token"); // Remove token from localStorage

    return { msg: response.data.msg }; // Return success message
  } catch (error) {
    console.error("Logout Error:", error);
    return rejectWithValue(error.response?.data?.message || "Logout failed.");
  }
});

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: getStoredToken(),
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearState: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      localStorage.removeItem("token"); // Clear the token from localStorage on logout
    },
    resetSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Registration successful! Please log in.";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.accessToken;
        state.user = action.payload.user;
        state.successMessage = "Login successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.msg;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.successMessage = action.payload.msg; // Use message from the fulfilled action
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Handle rejection gracefully
      });
  },
});

// Add the selectUser selector at the bottom
export const selectUser = (state) => state.auth.user;

export const { clearState, resetSuccessMessage } = authSlice.actions;
export default authSlice.reducer;
