import {
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_ERROR,
  REMOVE_FROM_CART_SUCCESS,
  REMOVE_FROM_CART_ERROR,
  TOGGLE_CART_ERROR,
  TOGGLE_CART_SUCCESS,
  REMOVE_CART_SUCCESS,
  REMOVE_CART_ERROR,
  GET_CART_SUCCESS_ERROR,
  GET_CART_SUCCESS,
  CLEAR_CART_FROM_STORE_ERROR,
  CLEAR_CART_FROM_STORE,
} from "../actions/types";
import axios from "axios";
import { setAlert } from "./alert";

// Get Cart
export const getCart = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/cart");
    dispatch({
      type: CLEAR_CART_FROM_STORE,
    });

    dispatch({
      type: GET_CART_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GET_CART_SUCCESS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
      // payload: { msg: "err.response.statusText", status: "err.response.status" },
    });
  }
};

// add to cart..>
export const addToCart = (product) => async (dispatch) => {
  try {
    const api = axios.create({
      headers: {
        "Content-type": "application/json",
      },
    });
    const { data } = await api.post("/api/cart", product);
    dispatch({
      type: ADD_TO_CART_SUCCESS,
      payload: data,
    });
    dispatch(setAlert("Product added", "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) return errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    dispatch({
      type: ADD_TO_CART_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Update to cart..>
export const updateToCart = (product) => async (dispatch) => {
  try {
    const api = axios.create({
      headers: {
        "Content-type": "application/json",
      },
    });
    const { data } = await api.post("/api/cart", product);
    dispatch({
      type: ADD_TO_CART_SUCCESS,
      payload: data,
    });
    dispatch(setAlert("Product updated", "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) return errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    dispatch({
      type: ADD_TO_CART_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// delete a cart item ..>
export const deleteCartItem = (prd_id) => async (dispatch) => {
  // dispatch({ type: REMOVE_FROM_CART_LOADING });
  try {
    const api = axios.create({
      headers: {
        "Content-type": "application/json",
      },
    });
    const { data } = await api.delete(`/api/cart/${prd_id}`);
    dispatch({
      type: REMOVE_FROM_CART_SUCCESS,
      payload: data,
    });
    dispatch(setAlert("Product Deleted", "danger"));
  } catch (err) {
    const errors = err.response.data.errors ? err.response.data.errors : null;
    if (errors) return errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    dispatch({
      type: REMOVE_FROM_CART_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// delete whole cart ..>
export const deleteCart = () => async (dispatch) => {
  try {
    const api = axios.create({
      headers: {
        "Content-type": "application/json",
      },
    });
    const { data } = await api.delete("/api/cart");
    dispatch({
      type: REMOVE_CART_SUCCESS,
    });
    dispatch(getCart());
    data && dispatch(setAlert(data, "danger"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) return errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    dispatch({
      type: REMOVE_CART_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Toggle Cart
export const toggleCart = () => (dispatch) => {
  try {
    dispatch({ type: TOGGLE_CART_SUCCESS });
  } catch (err) {
    dispatch({
      type: TOGGLE_CART_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Clear Cart at logout
export const clearCart = () => (dispatch) => {
  try {
    dispatch({
      type: CLEAR_CART_FROM_STORE,
    });
    dispatch(getCart());
  } catch (err) {
    dispatch({
      type: CLEAR_CART_FROM_STORE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
