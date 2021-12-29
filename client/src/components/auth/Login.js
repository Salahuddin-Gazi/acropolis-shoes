import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../redux/actions/auth";
import PropTypes from "prop-types";

const Login = ({ login, isAuthenticated }) => {
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
    login(email, password);
  };

  const navigate = useNavigate();
  if (isAuthenticated) {
    // return <Navigate to="/" />;
    navigate(-1);
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead text-white">
        <i className="fas fa-user"></i> Login To Your Account
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
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({ isAuthenticated: state.auth.isAuthenticated });

export default connect(mapStateToProps, { login })(Login);
