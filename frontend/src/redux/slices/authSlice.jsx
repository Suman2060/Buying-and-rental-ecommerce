import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";

// Updated API URLs
const API_URLS = {
  register: "http://127.0.0.1:8000/user/register/",
  login: "http://127.0.0.1:8000/user/login/",
  profile: "http://127.0.0.1:8000/user/profile/",
  changePassword: "http://127.0.0.1:8000/user/change-password/",
  logout: "http://127.0.0.1:8000/user/logout/"
};

// User Registration
export const registerUser = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(API_URLS.register, userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Something went wrong.");
  }
});

// User Login
export const loginUser = createAsyncThunk("auth/login", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(API_URLS.login, userData);
    const { token } = response.data;
    localStorage.setItem("token", JSON.stringify(token));  // Store token
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed.");
  }
});

// Fetch User Profile
export const getUserProfile = createAsyncThunk("auth/profile", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(API_URLS.profile);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch profile.");
  }
});

// Change Password
export const changePassword = createAsyncThunk("auth/changePassword", async (passwordData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(API_URLS.changePassword, passwordData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Password change failed.");
  }
});

// User Logout
export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.post(API_URLS.logout);
    localStorage.removeItem("token");  // Clear token from localStorage
    return { msg: "Logout successful" };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Logout failed.");
  }
});

// Redux Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null, // Initialize token from localStorage
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
      localStorage.removeItem("token");
    },
    resetSuccessMessage: (state) => {
      state.successMessage = null; // Reset success message
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => { state.loading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;  // Corrected the token name
        state.successMessage = "Login successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Profile
      .addCase(getUserProfile.pending, (state) => { state.loading = true; })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Change Password
      .addCase(changePassword.pending, (state) => { state.loading = true; })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.msg;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => { state.loading = true; })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.successMessage = "Logout successful";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState, resetSuccessMessage } = authSlice.actions;
export default authSlice.reducer;
