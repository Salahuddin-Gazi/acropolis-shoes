import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { setAuthToken, setAdminAuthToken, removeAuthToken } from "./components/utils/setAuthToken";
import AppRoutes from "./components/routing/AppRoutes";
import Navbar from "./components/layout/Navbar";
import axios from "axios";

// redux
import store from "./store/store";
import { Provider } from "react-redux";
import { loadUser, loadAdmin } from "./components/redux/actions/auth";
import { getProducts } from "./components/redux/actions/product";
import { getCart } from "./components/redux/actions/cart";
import { getProfile, getProfiles } from "./components/redux/actions/profile";

// axios
const port = process.env.PORT;
axios.defaults.baseURL = "https://agile-wave-00269.herokuapp.com:" + port;

//  Setting common token for axios
// localStorage ? localStorage.token && setAuthToken(localStorage.token) : localStorage.adminToken && setAdminAuthToken(localStorage.adminToken);

const App = () => {
  // [], means it will run once as the function is loaded.
  useEffect(() => {
    store.dispatch(getProfiles());
    store.dispatch(getProducts());
    store.dispatch(loadAdmin());
    store.dispatch(loadUser());
    console.log("Domo");
    if (localStorage.token) {
      store.dispatch(getCart());
      store.dispatch(getProfile());
      return;
    }
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Routes>
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
