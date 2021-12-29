import {
  GET_PROFILE,
  GET_PROFILES,
  ADD_PROFILE,
  DELETE_PROFILE,
  ADD_ADDRESS,
  DELETE_ADDRESS,
  ADD_ORDER,
  DELETE_ORDER,
  UPDATE_AVATAR_LOADING,
  UPDATE_AVATAR,
  UPDATE_AVATAR_ERROR,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  TOGGLE_ADDRESS,
  TOGGLE_ORDER,
  TOGGLE_PAYMENT,
  ADD_PAYMENT,
  DELETE_PAYMENT,
} from "../actions/types";

const initialState = {
  profiles: [],
  addressBook: [],
  orders: [],
  avatar: null,
  loading: true,
  profileAvatarLoading: false,
  toggleAddress: false,
  toggleOrder: false,
  togglePayment: false,
  error: null,
};

const profile = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_PROFILE:
    case ADD_PROFILE:
      return {
        ...state,
        ...payload,
        loading: false,
        error: null,
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false,
        error: null,
      };
    case ADD_ADDRESS:
      return {
        ...state,
        addressBook: [payload, ...state.addressBook],
        loading: false,
        toggleAddress: false,
        error: null,
      };
    case ADD_PAYMENT:
      return {
        ...state,
        payments: [payload, ...state.payments],
        loading: false,
        togglePayment: false,
        error: null,
      };
    case ADD_ORDER:
      return {
        ...state,
        orders: [payload, ...state.orders],
        loading: false,
        toggleOrder: false,
        error: null,
      };
    case UPDATE_AVATAR_LOADING:
      return {
        ...state,
        loading: false,
        profileAvatarLoading: true,
        error: null,
      };
    case UPDATE_AVATAR:
      return {
        ...state,
        avatar: payload,
        loading: false,
        profileAvatarLoading: false,
      };
    case DELETE_PROFILE:
    case CLEAR_PROFILE:
      return {
        profiles: [...state.profiles],
        addressBook: [],
        orders: [],
        avatar: null,
        loading: false,
        profileAvatarLoading: false,
        toggleAddress: false,
        toggleOrder: false,
        togglePayment: false,
        error: null,
      };
    case DELETE_ADDRESS:
      return {
        ...state,
        addressBook: state.addressBook.filter((address) => address._id !== payload),
        loading: false,
        error: null,
      };
    case DELETE_ORDER:
      return {
        ...state,
        orders: state.orders.filter((order) => order._id !== payload),
        loading: false,
        error: null,
      };
    case DELETE_PAYMENT:
      return {
        ...state,
        payments: state.payments.filter((payment) => payment._id !== payload),
        loading: false,
        error: null,
      };
    case TOGGLE_ADDRESS:
      return {
        ...state,
        loading: false,
        toggleAddress: !state.toggleAddress,
        error: null,
      };
    case TOGGLE_ORDER:
      return {
        ...state,
        loading: false,
        toggleAddress: !state.toggleOrder,
        error: null,
      };
    case TOGGLE_PAYMENT:
      return {
        ...state,
        loading: false,
        togglePayment: !state.togglePayment,
        error: null,
      };
    case PROFILE_ERROR:
    case UPDATE_AVATAR_ERROR:
      return {
        ...state,
        loading: false,
        profileAvatarLoading: false,
        error: payload,
      };
    default:
      return state;
  }
};

export default profile;
