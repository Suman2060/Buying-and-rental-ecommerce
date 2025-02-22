// src/redux/slices/bikeSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for updating bike availability
export const updateBikeAvailability = createAsyncThunk(
  'bike/updateAvailability',
  async ({ bikeId, isAvailable }, { getState, rejectWithValue }) => {
    try {
      const { userLogin: { userInfo } } = getState();
      
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`, // Get token from Redux state
        },
      };

      const { data } = await axios.put(
        `http://127.0.0.1:8000/api/bikes/${bikeId}/availability/`,
        { is_available: isAvailable },
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  }
);

const bikeSlice = createSlice({
  name: 'bike',
  initialState: {
    bike: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateBikeAvailability.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBikeAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.bike = action.payload;
      })
      .addCase(updateBikeAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bikeSlice.reducer;
