import {
  GET_PROFILE,
  GET_PROFILES,
  ADD_PROFILE,
  // DELETE_PROFILE,
  ADD_ADDRESS,
  DELETE_ADDRESS,
  ADD_ORDER,
  UPDATE_AVATAR_LOADING,
  UPDATE_AVATAR,
  UPDATE_AVATAR_ERROR,
  // DELETE_ORDER,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  TOGGLE_ADDRESS,
  TOGGLE_ORDER,
  TOGGLE_PAYMENT,
  ADD_PAYMENT,
  DELETE_PAYMENT,
} from "../actions/types";
import axios from "axios";
import { setAlert } from "./alert";

// get user profile
export const getProfile = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/profile");
    dispatch({
      type: GET_PROFILE,
      payload: data,
    });
  } catch (err) {
    err.response
      ? dispatch({
          type: PROFILE_ERROR,
          payload: { msg: err.response.statusText, status: err.response.status },
        })
      : dispatch(setAlert("Something went wrong!", "danger"));
  }
};

// get users profile
export const getProfiles = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/profile/profiles");
    dispatch({
      type: GET_PROFILES,
      payload: data,
    });
  } catch (err) {
    err.response
      ? dispatch({
          type: PROFILE_ERROR,
          payload: { msg: err.response.statusText, status: err.response.status },
        })
      : dispatch(setAlert("Something went wrong!", "danger"));
  }
};

// add profile
export const addProfile = () => async (dispatch) => {
  try {
    const { data } = await axios.post("/api/profile");
    if (typeof data === "object") {
      dispatch({
        type: ADD_PROFILE,
        payload: data,
      });
      return dispatch(setAlert("Profile Created", "success"));
    }
    dispatch(setAlert(data, "danger"));
  } catch (err) {
    if (err.response) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    } else {
      dispatch(setAlert("Something went wrong!", "danger"));
    }
  }
};

// clear local profile
export const clearProfile = () => (dispatch) => {
  try {
    dispatch({
      type: CLEAR_PROFILE,
    });
  } catch (err) {
    err.response
      ? dispatch({
          type: PROFILE_ERROR,
          payload: { msg: err.response.statusText, status: err.response.status },
        })
      : dispatch(setAlert("Something went wrong!", "danger"));
  }
};

// add user address
export const addAddress = (addressBook) => async (dispatch) => {
  try {
    const api = axios.create({
      headers: {
        "Content-type": "application/json",
      },
    });
    const { data } = await api.put("/api/profile/address", addressBook);
    dispatch({
      type: ADD_ADDRESS,
      payload: data,
    });
    dispatch(setAlert("Contact Added 👍", "success"));
  } catch (err) {
    if (err.response) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    } else {
      dispatch(setAlert("Something went wrong!", "danger"));
    }
  }
};

// delete a address
export const deleteAddress = (addressId) => async (dispatch) => {
  try {
    const { data } = await axios.delete(`/api/profile/address/${addressId}`);
    dispatch({
      type: DELETE_ADDRESS,
      payload: addressId,
    });
    dispatch(setAlert(data, "danger"));
  } catch (err) {
    err.response
      ? dispatch({
          type: PROFILE_ERROR,
          payload: { msg: err.response.statusText, status: err.response.status },
        })
      : dispatch(setAlert("Something went wrong!", "danger"));
  }
};

// add user order
export const addOrder = (orderBook) => async (dispatch) => {
  try {
    const api = axios.create({
      headers: {
        "Content-type": "application/json",
      },
    });
    const { data } = await api.put("/api/profile/orders", orderBook);
    dispatch({
      type: ADD_ORDER,
      payload: data,
    });
    dispatch(setAlert("Order Added 👍", "success"));
  } catch (err) {
    if (err.response) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    } else {
      dispatch(setAlert("Something went wrong!", "danger"));
    }
  }
};

// add user payment method
export const addPayment = (paymentBook) => async (dispatch) => {
  try {
    const api = axios.create({
      headers: {
        "Content-type": "application/json",
      },
    });
    const { data } = await api.put("/api/profile/payments", paymentBook);
    dispatch({
      type: ADD_PAYMENT,
      payload: data,
    });
    dispatch(setAlert("Payment Method Added", "success"));
  } catch (err) {
    if (err.response) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    } else {
      dispatch(setAlert("Something went wrong!", "danger"));
    }
  }
};

// delete a address
export const deletePayment = (paymentId) => async (dispatch) => {
  try {
    const { data } = await axios.delete(`/api/profile/payments/${paymentId}`);
    dispatch({
      type: DELETE_PAYMENT,
      payload: paymentId,
    });
    dispatch(setAlert("Payment Method Deleted", "danger"));
  } catch (err) {
    err.response
      ? dispatch({
          type: PROFILE_ERROR,
          payload: { msg: err.response.statusText, status: err.response.status },
        })
      : dispatch(setAlert("Something went wrong!", "danger"));
  }
};

// Update profile avatar
export const updateAvatar = (avatarImage) => async (dispatch) => {
  const api = axios.create({
    headers: {
      "Content-type": "application/json",
    },
  });
  dispatch({
    type: UPDATE_AVATAR_LOADING,
  });
  try {
    const { data } = await api.put("/api/profile/avatar", avatarImage);
    dispatch({
      type: UPDATE_AVATAR,
      payload: data,
    });
    dispatch(setAlert("Profile Updated", "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: UPDATE_AVATAR_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Toggle Address
export const toggleUserAddress = () => (dispatch) => {
  try {
    dispatch({
      type: TOGGLE_ADDRESS,
    });
  } catch (err) {
    err.response
      ? dispatch({
          type: PROFILE_ERROR,
          payload: { msg: err.response.statusText, status: err.response.status },
        })
      : dispatch(setAlert("Something went wrong!", "danger"));
  }
};

// Toggle Order
export const toggleUserOrder = () => (dispatch) => {
  try {
    dispatch({
      type: TOGGLE_ORDER,
    });
  } catch (err) {
    err.response
      ? dispatch({
          type: PROFILE_ERROR,
          payload: { msg: err.response.statusText, status: err.response.status },
        })
      : dispatch(setAlert("Something went wrong!", "danger"));
  }
};

// Toggle Payment
export const toggleUserPayment = () => (dispatch) => {
  try {
    dispatch({
      type: TOGGLE_PAYMENT,
    });
  } catch (err) {
    err.response
      ? dispatch({
          type: PROFILE_ERROR,
          payload: { msg: err.response.statusText, status: err.response.status },
        })
      : dispatch(setAlert("Something went wrong!", "danger"));
  }
};
