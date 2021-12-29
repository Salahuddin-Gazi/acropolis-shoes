import {
  ADD_PRODUCT,
  CLEAR_PRODUCT,
  GET_PRODUCT,
  GET_PRODUCTS,
  PRODUCT_ERROR,
  REMOVE_PRODUCT,
  UPDATE_PRODUCT,
  UPDATE_LIKE,
  ADD_COMMENT,
  DELETE_COMMENT,
  PRODUCT_LOADING,
  COMMENT_LOADING,
} from "./types";
import axios from "axios";
import { setAlert } from "./alert";

// Get all the products
export const getProducts = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/product");
    dispatch({
      type: GET_PRODUCTS,
      payload: data,
    });
    // dispatch(setAlert("Fetched Products Successfully", "success"));
  } catch (err) {
    // console.log(err);
    if (err.response) {
      dispatch({
        type: PRODUCT_ERROR,
        // payload: { msg: "err.response.statusText", status: "err.response.status" },
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

// Get product by id
export const getProduct = (product_id) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/product/${product_id}`);
    dispatch({ type: CLEAR_PRODUCT });
    dispatch({
      type: GET_PRODUCT,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
      // payload: { msg: "Error Occured", status: 500 },
    });
  }
};

// Create a product
export const createProduct = (formData) => async (dispatch) => {
  dispatch({ type: PRODUCT_LOADING });
  try {
    const api = axios.create({
      headers: {
        "Content-type": "application/json",
      },
    });
    const { data } = await api.post(`/api/product`, formData);
    dispatch({
      type: ADD_PRODUCT,
      payload: data,
    });
    dispatch(setAlert("Product Created", "success"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Update product by id
export const updateProduct = (formData, product_id) => async (dispatch) => {
  dispatch({ type: PRODUCT_LOADING });
  try {
    const api = axios.create({
      headers: {
        "Content-type": "application/json",
      },
    });
    const { data } = await api.put(`/api/product/${product_id}`, formData);
    dispatch({
      type: UPDATE_PRODUCT,
      payload: data,
    });
    dispatch(setAlert("Product Updated", "success"));
    dispatch(getProducts());
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete a product by ID
export const deleteProduct = (product_id) => async (dispatch) => {
  try {
    const api = axios.create({
      headers: {
        "Content-type": "application/json",
      },
    });
    const { data } = await api.delete(`/api/product/${product_id}`);
    dispatch({ type: CLEAR_PRODUCT });
    dispatch({
      type: REMOVE_PRODUCT,
      payload: product_id,
    });
    dispatch(setAlert(data.msg, "danger"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Update Product Likes
export const updateLike = (id) => async (dispatch) => {
  try {
    const { data } = await axios.put(`http://localhost:5000/api/product/post/like/${id}`);
    dispatch(getProduct(id));
    dispatch({ type: UPDATE_LIKE });
    dispatch(setAlert(data, "success"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add Comment To Product
export const addComment = (prd_id, description) => async (dispatch) => {
  dispatch({ type: COMMENT_LOADING });
  try {
    const api = axios.create({
      headers: {
        "Content-type": "application/json",
      },
    });
    const { data } = await api.put(`http://localhost:5000/api/product/post/comment/${prd_id}`, description);
    dispatch(getProduct(prd_id));
    dispatch({ type: ADD_COMMENT });
    dispatch(setAlert(data, "success"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete a Comment
export const deleteComment = (prd_id, cmnt_id) => async (dispatch) => {
  dispatch({ type: COMMENT_LOADING });
  try {
    const { data } = await axios.delete(`http://localhost:5000/api/product/post/comment/${prd_id}/${cmnt_id}`);
    dispatch(getProduct(prd_id));
    dispatch({ type: DELETE_COMMENT });
    dispatch(setAlert(data, "danger"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
