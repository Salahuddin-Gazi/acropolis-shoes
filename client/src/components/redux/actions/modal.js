import { TOGGLE_MODAL, TOGGLE_MODAL_LOADING, TOGGLE_MODAL_ERROR, TOGGLE_MODAL_CLEAR } from "./types";
export const toggleModal = (img) => (dispatch) => {
  dispatch({ type: TOGGLE_MODAL_LOADING });
  try {
    dispatch({ type: TOGGLE_MODAL, payload: img });
  } catch (err) {
    dispatch({
      type: TOGGLE_MODAL_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
export const toggleModalClear = () => (dispatch) => {
  dispatch({ type: TOGGLE_MODAL_LOADING });
  try {
    dispatch({ type: TOGGLE_MODAL_CLEAR });
  } catch (err) {
    dispatch({
      type: TOGGLE_MODAL_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
