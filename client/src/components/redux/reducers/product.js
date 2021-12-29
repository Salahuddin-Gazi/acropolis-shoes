import {
  GET_PRODUCTS,
  GET_PRODUCT,
  PRODUCT_ERROR,
  REMOVE_PRODUCT,
  ADD_PRODUCT,
  CLEAR_PRODUCT,
  UPDATE_PRODUCT,
  UPDATE_LIKE,
  ADD_COMMENT,
  DELETE_COMMENT,
  PRODUCT_LOADING,
  COMMENT_LOADING,
} from "../actions/types";

const initialState = {
  product: null,
  products: [],
  loading: true,
  commentLoading: false,
  error: {},
};

const product = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case PRODUCT_LOADING:
      return {
        ...state,
        loading: true,
      };
    case COMMENT_LOADING:
      return {
        ...state,
        commentLoading: true,
      };
    case UPDATE_LIKE:
    case ADD_COMMENT:
    case DELETE_COMMENT:
      return {
        ...state,
        loading: false,
        commentLoading: false,
      };
    case GET_PRODUCTS:
      return {
        ...state,
        products: payload,
        loading: false,
      };
    case GET_PRODUCT:
    case UPDATE_PRODUCT:
    case ADD_PRODUCT:
      return {
        ...state,
        product: payload,
        loading: false,
      };
    case REMOVE_PRODUCT:
      return {
        ...state,
        products: state.products.filter((product) => product._id !== payload),
        loading: false,
      };
    case PRODUCT_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case CLEAR_PRODUCT:
      return {
        ...state,
        product: null,
        loading: false,
        error: {},
      };
    default:
      return state;
  }
};

export default product;
