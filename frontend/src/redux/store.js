import {configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import accessoryDetailReducer from "./slices/accessoryDetailSlice"
import productDetailReducer from "./slices/productDetailSlice"
export const store = configureStore({
    reducer: {
            cart: cartReducer,
            accessoryDetail: accessoryDetailReducer,
            productDetail: productDetailReducer

    },
});

export default store;