import React, { Fragment, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../redux/actions/alert";
import { register } from "../redux/actions/auth";
import PropTypes from "prop-types";
// import axios from "axios";

const Register = ({ setAlert, register, isAuthenticated }) => {
  // Using React Hook
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const { name, email, password, password2 } = formData;
  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else {
      register({ name, email, password });
      <Link to="/user/profile" />;
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead text-white">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group col-md-8 py-2 input-group-lg">
          <input type="text" className="form-control" placeholder="Name" name="name" value={name} onChange={(e) => onChange(e)} />
        </div>
        <div className="form-group col-md-8 pb-2 input-group-lg">
          <input type="email" className="form-control" placeholder="Email Address" name="email" value={email} onChange={(e) => onChange(e)} />
        </div>
        <div className="form-group col-md-8 pb-2 input-group-lg">
          <input type="password" className="form-control" placeholder="Password" name="password" value={password} onChange={(e) => onChange(e)} minLength="5" />
        </div>
        <div className="form-group col-md-8 pb-2 input-group-lg">
          <input
            type="password"
            className="form-control"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={(e) => onChange(e)}
            minLength="5"
          />
        </div>
        <div className="form-group col-md-2">
          <input type="submit" className="form-control btn btn-primary" value="Register" />
        </div>
      </form>
      <p className="my-1 text-white">
        Doen not have an account?{"  "}
        <Link to="/login" className="text-decoration-none fs-4">
          <i className="fa-solid fa-user-plus"></i> Login
        </Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
