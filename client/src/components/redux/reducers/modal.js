import { TOGGLE_MODAL, TOGGLE_MODAL_LOADING, TOGGLE_MODAL_ERROR, TOGGLE_MODAL_CLEAR } from "../actions/types";

const initialState = {
  image: "",
  loading: true,
  error: null,
};

const modal = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case TOGGLE_MODAL:
      return {
        ...state,
        image: payload,
        loading: false,
      };
    case TOGGLE_MODAL_LOADING:
      return {
        ...state,
        loading: true,
      };
    case TOGGLE_MODAL_CLEAR:
      return {
        ...state,
        image: "",
        loading: false,
      };
    case TOGGLE_MODAL_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
};

export default modal;
