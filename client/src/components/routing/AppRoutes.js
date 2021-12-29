import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import AdminLogin from "../auth/AdminLogin";
import Alert from "../Alert/Alert";
import NotFound from "../layout/NotFound";
import Landing from "../Products/Landing";
import AdminPrivateRoute from "./AdminPrivateRoute";
import AddProduct from "../product-form/AddProduct";
import EditProduct from "../product-form/EditProduct";
import Product from "../Product/Product";
import Cart from "../Cart/Cart";
import Order from "../Orders/Order";
// import PropTypes from "prop-types";

// redux
import { adminKey } from "../redux/actions/types";
// import { connect } from "react-redux";
import UserPrivateRoute from "./UserPrivateRoute";
import Profile from "../Profile/Profile";

const AppRoutes = () => (
  <section className="container py-2">
    <Alert />
    <Cart />
    <Routes>
      <Route index path="" element={<Landing />} />
      <Route path="login" element={<Login />} />
      <Route path={`admin/${adminKey}`} element={<AdminLogin />} />
      <Route path="register" element={<Register />} />
      <Route exact path="product/:prd_id" element={<Product />} />
      <Route
        strict
        path="cart/orders"
        element={
          <UserPrivateRoute>
            <Order />
          </UserPrivateRoute>
        }
      />
      <Route
        strict
        path="user/profile"
        element={
          <UserPrivateRoute>
            <Profile />
          </UserPrivateRoute>
        }
      />
      <Route
        strict
        path="addproduct"
        element={
          <AdminPrivateRoute>
            <AddProduct />
          </AdminPrivateRoute>
        }
      />
      <Route
        strict
        path="editproduct/:prd_id"
        element={
          <AdminPrivateRoute>
            <EditProduct />
          </AdminPrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </section>
);

// AppRoutes.prototype = {
//   _id: PropTypes.string.isRequired,
// };

// const mapStateToProps = (state) => ({
//   _id: state.cart.cart._id,
// });

export default AppRoutes;
