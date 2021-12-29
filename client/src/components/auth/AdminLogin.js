import React, { Fragment, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { adminLogin } from "../redux/actions/auth";
import PropTypes from "prop-types";

const AdminLogin = ({ adminLogin, isAuthenticated }) => {
  // Using React Hook
  const [formData, setFromData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const onChange = (e) => {
    setFromData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    adminLogin(email, password);
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Hello Admin!</h1>
      <p className="lead text-white">
        <i className="fas fa-user"></i> Admin, Login To Your Account (￣o￣) . z Z
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group col-md-8 py-3 input-group-lg">
          <input type="email" className="form-control" placeholder="Email Address" name="email" value={email} required onChange={(e) => onChange(e)} />
        </div>
        <div className="form-group col-md-8 pb-3 input-group-lg">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            name="password"
            value={password}
            required
            onChange={(e) => onChange(e)}
            minLength="5"
          />
        </div>
        <div className="form-group col-md-2">
          <input type="submit" className="form-control btn btn-primary" value="Log In" />
        </div>
      </form>
      <p className="my-1 text-white">
        Doen not have an account?{"  "}
        <Link to="/register" className="text-decoration-none fs-4">
          <i className="fa-solid fa-user-plus"></i> Sign Up
        </Link>
      </p>
      <small className="my-1 text-white d-block">email: admin@gg.com; password: 12345</small>
      <small className="my-1 text-white">Happy Hacking (*^▽^*)</small>
    </Fragment>
  );
};

AdminLogin.propTypes = {
  adminLogin: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({ isAuthenticated: state.auth.isAuthenticated });

export default connect(mapStateToProps, { adminLogin })(AdminLogin);
