import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const AdminPrivateRoute = ({ isAuthenticated, loading, admin, children }) => {
  return !isAuthenticated && !loading && admin === null ? <Navigate to="/login" /> : children;
};

AdminPrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool,
  loding: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  admin: state.auth.admin,
  loading: state.auth.loading,
});

export default connect(mapStateToProps)(AdminPrivateRoute);
