import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "../Spinner/Spinner";

// redux
import { connect } from "react-redux";
import { toggleModalClear } from "../redux/actions/modal";

const Modal = ({ modal: { image, loading }, toggleModalClear }) => {
  useEffect(() => {
    toggleModalClear();
  }, [toggleModalClear]);

  const modalClear = () => {
    toggleModalClear();
  };
  const Navigate = useNavigate();
  return loading ? (
    <Spinner />
  ) : (
    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-3 orderedModal">
          <div className="d-flex justify-content-center py-1 mb-2">
            <span className="">
              <i className="fas fa-check-circle align-middle modalIcon"></i>
            </span>
          </div>
          <div className="d-flex justify-content-center p-2">
            <span className="fs-3 modalDescription fw-bold">Your order has been submitted successfully, one of our agent will soon contact you.</span>
          </div>
          <div
            type="button"
            className="modalBtn text-white text-center dismiss-btn"
            data-bs-dismiss="modal"
            onClick={() => {
              modalClear();
              Navigate("/user/profile", { replace: true });
            }}
          >
            Dismiss
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  modal: PropTypes.object.isRequired,
  toggleModalClear: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  modal: state.modal,
});

export default connect(mapStateToProps, { toggleModalClear })(Modal);
