import { combineReducers } from "redux";
import product from "./product";
import alert from "./alert";
import auth from "./auth";
import cart from "./cart";
import modal from "./modal";
import profile from "./profile";

export default combineReducers({
  product,
  alert,
  auth,
  cart,
  modal,
  profile,
});
