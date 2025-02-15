import {configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import accessoryDetailReducer from "./slices/accessoryDetailSlice"
import productDetailReducer from "./slices/productDetailSlice"
import authReducer from "./slices/authSlice"




export const store = configureStore({
    reducer: {
            cart: cartReducer,
            accessoryDetail: accessoryDetailReducer,
            productDetail: productDetailReducer,
            auth: authReducer,
 },
 middleware: (getDefaultMiddleware)=>
    getDefaultMiddleware({
        serializableCheck: false, //to handle non-serializable value such as tokens

    })
});

export default store;