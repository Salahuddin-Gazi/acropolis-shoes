import axios from "axios";

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export const setAdminAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["x-admin-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-admin-auth-token"];
  }
};

export const removeAuthToken = () => {
  if (!localStorage.token) {
    delete axios.defaults.headers.common["x-auth-token"];
  }
  if (!localStorage.adminToken) {
    delete axios.defaults.headers.common["x-admin-auth-token"];
  }
  return;
};
