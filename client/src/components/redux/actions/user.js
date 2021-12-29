import axios from "axios";
import { setAlert } from "./alert";
import { UPDATE_AVATAR, UPDATE_AVATAR_LOADING, UPDATE_AVATAR_ERROR } from "./types";

// Update user avatar
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
    const { data } = await api.put("/api/users/avatar", avatarImage);
    dispatch({
      type: UPDATE_AVATAR,
      payload: data,
    });
    //   dispatch(loadUser());
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
