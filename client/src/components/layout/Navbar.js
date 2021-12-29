import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../redux/actions/auth";
import { toggleCart } from "../redux/actions/cart";
import PropTypes from "prop-types";

const Navbar = ({ auth: { isAuthenticated, user, loading }, profile, cart, logout, toggleCart }) => {
  const cart_length = cart.products && cart.products.length ? cart.products.length : "";
  const guestLinks = (
    <ul className="navbar-nav d-flex m-auto mb-2 mb-lg-0">
      <li className="nav-item">
        <Link className="nav-link" to="/register">
          <i className="fa-solid fa-user-plus"></i> Register
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/login">
          <i className="fa-solid fa-right-to-bracket"></i> Login
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/admin/1234">
          <i className="fas fa-user" /> Admin
        </Link>
      </li>
    </ul>
  );

  const userLinks = (
    // <div className="d-flex m-auto ">
    <ul className="navbar-nav d-flex m-auto mb-2 mb-lg-0">
      <li className="nav-item">
        <Link className="nav-link" to="user/profile">
          {profile && profile.avatar ? (
            <img src={profile.avatar} className="rounded-circle" alt="..." style={{ width: "30px", height: "30px", display: "inline" }} />
          ) : (
            <i className="fas fa-user-circle"></i>
          )}
          <span style={{ display: "inline" }}> {profile.name ? profile.name.split(" ")[0] : "Profile"}</span>
        </Link>
      </li>
      <li className="nav-item cartDrawer">
        <a className="nav-link" href="#!" onClick={() => toggleCart()}>
          <i className="fas fa-cart-arrow-down"></i> Cart
          <sup>
            <span className="position-absolute top-5 start-100 translate-middle badge rounded-pill bg-danger">{cart_length}</span>
          </sup>
        </a>
      </li>
      <li className="nav-item">
        <a href="#!" className="nav-link" onClick={() => logout()}>
          <i className="fas fa-sign-out-alt" /> Logout
        </a>
      </li>
    </ul>
    // </div>
  );

  const adminLinks = (
    // <div className="d-flex m-auto ">
    <ul className="navbar-nav d-flex m-auto mb-2 mb-lg-0">
      <li className="nav-item">
        <a href="#!" className="nav-link disabled">
          <i className="fas fa-users-cog"></i> Admin
        </a>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/addproduct">
          <i className="fas fa-plus-circle"></i> Add Product
        </Link>
      </li>
      {/* <li className="nav-item">
          <Link className="nav-link" to="/dashboard">
            <i className="fas fa-user" /> Dashboard
          </Link>
        </li> */}
      <li className="nav-item">
        <a href="#!" className="nav-link" onClick={() => logout()}>
          <i className="fas fa-sign-out-alt" /> Logout
        </a>
      </li>
    </ul>
    // </div>
  );

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <div className="container-fluid">
        <h1>
          <Link to="/" className="navbar-brand ms-2">
            <span className="text-primary fw-bold fs-3">A</span>cropolis<span className="text-danger fw-bold fs-3">S</span>hoes
          </Link>
        </h1>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {!loading && <Fragment>{isAuthenticated ? (user ? userLinks : adminLinks) : guestLinks}</Fragment>}
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  toggleCart: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  // cart: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  cart: state.cart.cart,
  profile: state.profile,
});

export default connect(mapStateToProps, { logout, toggleCart })(Navbar);
