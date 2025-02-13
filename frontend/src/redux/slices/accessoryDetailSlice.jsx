import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch accessory details
export const fetchAccessoryDetail = createAsyncThunk(
  "accessoryDetail/fetchAccessoryDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/api/accessories/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const accessoryDetailSlice = createSlice({
  name: "accessoryDetail",
  initialState: {
    accessory: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearAccessoryDetail: (state) => {
      state.accessory = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccessoryDetail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAccessoryDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accessory = action.payload;
      })
      .addCase(fetchAccessoryDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearAccessoryDetail } = accessoryDetailSlice.actions;
export default accessoryDetailSlice.reducer;
