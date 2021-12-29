import {
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_LOADING,
  ADD_TO_CART_ERROR,
  REMOVE_FROM_CART_SUCCESS,
  REMOVE_FROM_CART_ERROR,
  REMOVE_FROM_CART_LOADING,
  TOGGLE_CART_ERROR,
  TOGGLE_CART_LOADING,
  TOGGLE_CART_SUCCESS,
  REMOVE_CART_SUCCESS,
  REMOVE_CART_SUCCESS_LOADING,
  REMOVE_CART_ERROR,
  GET_CART_SUCCESS_LOADING,
  GET_CART_SUCCESS_ERROR,
  GET_CART_SUCCESS,
  CLEAR_CART_FROM_STORE_ERROR,
  CLEAR_CART_FROM_STORE,
  CLEAR_CART_FROM_STORE_LOADING,
} from "../actions/types";

const initialState = {
  cart: {},
  loading: true,
  error: null,
  isHidden: true,
};

const cart = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_TO_CART_SUCCESS:
    case REMOVE_FROM_CART_SUCCESS:
    case GET_CART_SUCCESS:
      return {
        ...state,
        cart: payload,
        loading: false,
      };
    case TOGGLE_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        isHidden: !state.isHidden,
      };
    case REMOVE_CART_SUCCESS:
    case CLEAR_CART_FROM_STORE:
      return {
        ...state,
        cart: {
          user: {},
          products: [],
        },
        loading: false,
        error: null,
        isHidden: true,
      };
    case ADD_TO_CART_LOADING:
    case TOGGLE_CART_LOADING:
    case REMOVE_FROM_CART_LOADING:
    case GET_CART_SUCCESS_LOADING:
    case REMOVE_CART_SUCCESS_LOADING:
    case CLEAR_CART_FROM_STORE_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_TO_CART_ERROR:
    case TOGGLE_CART_ERROR:
    case REMOVE_FROM_CART_ERROR:
    case CLEAR_CART_FROM_STORE_ERROR:
    case REMOVE_CART_ERROR:
    case GET_CART_SUCCESS_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
};

export default cart;
