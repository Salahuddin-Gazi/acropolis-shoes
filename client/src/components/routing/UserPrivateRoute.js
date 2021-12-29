import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const UserPrivateRoute = ({ isAuthenticated, loading, user, children }) => {
  return !isAuthenticated && !loading && user === null ? <Navigate to="/login" /> : children;
};

UserPrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool,
  loding: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  loading: state.auth.loading,
});

export default connect(mapStateToProps)(UserPrivateRoute);
