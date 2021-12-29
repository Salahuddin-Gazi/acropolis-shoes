import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  AUTH_ERROR,
  USER_LOADED,
  GUEST_LOADED,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  ACCOUNT_DELETE,
  ADMIN_LOADED,
  ADMIN_LOGIN,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  adminToken: localStorage.getItem("adminToken"),
  isAuthenticated: null,
  loading: true,
  user: null,
  admin: null,
};

const auth = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case GUEST_LOADED:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
      };
    case ADMIN_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        admin: payload,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case ADMIN_LOGIN:
      localStorage.setItem("adminToken", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAILURE:
    case LOGOUT:
    case ACCOUNT_DELETE:
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      return {
        ...state,
        token: null,
        isAuthenticated: null,
        loading: false,
        user: null,
        admin: null,
      };
    default:
      return state;
  }
};

export default auth;
