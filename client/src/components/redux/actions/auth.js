import axios from "axios";
import { setAuthToken, setAdminAuthToken, removeAuthToken } from "../../utils/setAuthToken";
import { setAlert } from "./alert";
import { clearCart, getCart } from "./cart";
import { clearProfile, getProfile } from "./profile";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  AUTH_ERROR,
  USER_LOADED,
  GUEST_LOADED,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  ADMIN_LOADED,
  ADMIN_LOGIN,
  adminKey,
} from "./types";

// load a user
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
    try {
      const { data } = await axios.get("/api/auth");
      dispatch({
        type: USER_LOADED,
        payload: data,
      });
      dispatch(getCart());
    } catch (err) {
      console.log(err);
      dispatch({
        type: AUTH_ERROR,
      });
    }
    return;
  } else {
    if (!localStorage.token) {
      removeAuthToken();
    }
    return dispatch({
      type: GUEST_LOADED,
    });
  }
};

// Load Admin
export const loadAdmin = () => async (dispatch) => {
  if (localStorage.adminToken) {
    setAdminAuthToken(localStorage.adminToken);
    try {
      const { data } = await axios.get(`/api/auth/admin/${adminKey}`);
      dispatch({
        type: ADMIN_LOADED,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: AUTH_ERROR,
      });
    }
    return;
  } else {
    if (!localStorage.adminToken) {
      // console.log(!localStorage.adminToken);
      removeAuthToken();
    }
    return dispatch({
      type: GUEST_LOADED,
    });
  }
};

// Register User
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const body = JSON.stringify({ name, email, password });
    const api = axios.create({
      headers: {
        "Content-type": "application/json",
      },
    });
    try {
      const { data } = await api.post("/api/users", body);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: data,
      });
      dispatch(loadUser());
      dispatch(getProfile());
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

// Login User
export const login = (email, password) => async (dispatch) => {
  const body = JSON.stringify({ email, password });
  const api = axios.create({
    headers: {
      "Content-type": "application/json",
    },
  });
  try {
    const { data } = await api.post("/api/auth", body);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data,
    });
    dispatch(loadUser());
    dispatch(getCart());
    dispatch(getProfile());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: LOGIN_FAILURE,
    });
  }
};

// Logout user / Clear Profile
export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
  dispatch(clearCart());
  dispatch(clearProfile());
  if (!localStorage.token || !localStorage.adminToken) {
    removeAuthToken();
    return;
  }
  // dispatch({
  //   type: CLEAR_PRODUCT,
  // });
};

// Login Admin
export const adminLogin = (email, password) => async (dispatch) => {
  const body = JSON.stringify({ email, password });
  const api = axios.create({
    headers: {
      "Content-type": "application/json",
    },
  });
  try {
    const { data } = await api.post(`/api/auth/admin/${adminKey}`, body);
    dispatch({
      type: ADMIN_LOGIN,
      payload: data,
    });
    dispatch(loadAdmin());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: LOGIN_FAILURE,
    });
  }
};
