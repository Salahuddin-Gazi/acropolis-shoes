import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { toggleModalClear } from "../redux/actions/modal";
import Spinner from "../Spinner/Spinner";

const Modal = ({ modal: { image, loading }, toggleModalClear }) => {
  useEffect(() => {
    toggleModalClear();
  }, [toggleModalClear]);

  const modalClear = () => {
    toggleModalClear();
  };
  return loading ? (
    <Spinner />
  ) : (
    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <header className="fs-3">Large Preview</header>
            <button type="button" className="btn" data-bs-dismiss="modal" onClick={() => modalClear()}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="modal-body">
            <img src={image} className="modal-img m-auto" alt="Preview" style={{ maxWidth: "750px", maxHeight: "500px" }} />
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
