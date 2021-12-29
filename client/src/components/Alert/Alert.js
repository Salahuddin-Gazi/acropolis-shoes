import React from "react";
import "./Alert.css";
import PropTypes from "prop-types";

// redux
import { connect } from "react-redux";
import { removeAlert } from "../redux/actions/alert";

const Alert = ({ alerts, removeAlert }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => {
    if (alert.alertType === "danger")
      return (
        <div key={alert.id} className="alert alertDanger">
          <span>
            <i className="fas fa-exclamation-circle mx-1"></i>
          </span>
          {/* <div className="column"> */}
          <span className="message">Danger: {alert.msg}</span>
          {/* </div> */}
          <span className="close-btn" onClick={() => removeAlert(alert.id)}>
            <span className="fas fa-times"></span>
          </span>
        </div>
      );
    if (alert.alertType === "warning")
      return (
        <div className="alert alertWarning" key={alert.id}>
          <span>
            <i className="fas fa-exclamation-circle mx-1"></i>
          </span>
          {/* <div className="column"> */}
          <span className="message">Warning: {alert.msg}</span>
          {/* </div> */}
          <span className="close-btn" onClick={() => removeAlert(alert.id)}>
            <span className="fas fa-times"></span>
          </span>
        </div>
      );
    if (alert.alertType === "success")
      return (
        <div className="alert alertSuccess" key={alert.id}>
          <span>
            <i className="far fa-check-circle mx-1 text-success"></i>
          </span>
          <span className="message">Success: {alert.msg}</span>
          <span className="close-btn" onClick={() => removeAlert(alert.id)}>
            <span className="fas fa-times"></span>
          </span>
        </div>
      );
    return null;
  });
Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
  removeAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps, { removeAlert })(Alert);
