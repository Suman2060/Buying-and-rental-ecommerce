import {configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import accessoryDetailReducer from "./slices/accessoryDetailSlice"
import productDetailReducer from "./slices/productDetailSlice"
import authReducer from "./slices/authSlice"
import bikeReducer from "./slices/bikeSlice"




export const store = configureStore({
    reducer: {
            cart: cartReducer,
            accessoryDetail: accessoryDetailReducer,
            productDetail: productDetailReducer,
            auth: authReducer,
            bike:bikeReducer
 },
 middleware: (getDefaultMiddleware)=>
    getDefaultMiddleware({
        serializableCheck: false, //to handle non-serializable value such as tokens

    })
});

export default store;