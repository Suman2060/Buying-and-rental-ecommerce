import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authRequest } from "../../services/authRequest";
import { API_URLS } from "../slices/authSlice";
import axios from "axios";

// Async thunk to fetch cart items
export const fetchCart = createAsyncThunk("cart/fetch", async (token) => {
  const response = await axios.get("http://127.0.0.1:8000/api/cart/view/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

// Update Cart Item
export const updateCartItem = createAsyncThunk(
  "cart/updateItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await authRequest("PUT", API_URLS.updateCartItem, {
        product_id: productId,
        quantity,
      });
      return { productId, quantity };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update cart item.");
    }
  }
);

// Remove Cart Item
export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async (productId, { rejectWithValue }) => {
    try {
      await authRequest("DELETE", API_URLS.removeCartItem, { product_id: productId });
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove item from cart.");
    }
  }
);

// Checkout
export const checkout = createAsyncThunk(
  "cart/checkout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authRequest("POST", API_URLS.checkout);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to complete the checkout process.");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], status: "idle", error: null },
  reducers: {
    resetCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch cart items.";
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const { productId, quantity } = action.payload;
        const existingItem = state.items.find((item) => item.product_id === productId);
        if (existingItem) {
          existingItem.quantity = quantity;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload || "Failed to update cart item.";
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        const productId = action.payload;
        state.items = state.items.filter((item) => item.product_id !== productId);
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = action.payload || "Failed to remove item from cart.";
      })
      .addCase(checkout.fulfilled, (state) => {
        state.items = [];
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(checkout.rejected, (state, action) => {
        state.error = action.payload || "Failed to complete the checkout process.";
        state.status = "failed";
      });
  },
});

export const { resetCartError } = cartSlice.actions;
export default cartSlice.reducer;
