import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_FAIL,
    PRODUCT_LIST_SUCCESS,
  } from "../constants/productconstants";
  
  export const productsListReducers = (state = { products: [] }, action) => {
    switch (action.type) {
      case PRODUCT_LIST_REQUEST:
        return { loading: true, products: [] };
  
      case PRODUCT_LIST_SUCCESS:
        return { loading: false, products: action.payload };
  
      case PRODUCT_LIST_FAIL:
        return { loading: false, error: action.payload };
  
      default:
        return state;
    }
  };
  