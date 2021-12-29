import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

// redux
import { connect } from "react-redux";
import { addPayment } from "../../redux/actions/profile";

const AddPayment = ({ addPayment }) => {
  useEffect(() => {
    document.querySelector("#visaCard").addEventListener("keydown", (e) => {
      e.target.value = e.target.value.replace(/(\d{4})(\d+)/g, "$1 $2");
    });
  }, []);

  // Using React Hook
  const [formData, setFormData] = useState({
    _id: uuidv4(),
    visa: "",
    expires: "2021-12",
    ccv: "",
    cardHolderName: "",
  });
  const { visa, expires, ccv, cardHolderName } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    addPayment(formData);
  };
  return (
    <div>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <small className="d-block">* marks need to be flled.</small>
        <i className="fa-brands fa-cc-visa fs-3"></i>
        <div className="form-group py-2 input-group-lg">
          <input
            type="text"
            className="form-control"
            id="visaCard"
            placeholder="* Visa Card Number"
            name="visa"
            value={visa}
            onChange={(e) => onChange(e)}
            minLength="14"
            maxLength="23"
            required
          />
        </div>
        <div className="form-group pb-2 input-group-lg">
          <input type="month" className="form-control" placeholder="* Expires" name="expires" value={expires} onChange={(e) => onChange(e)} required />
        </div>
        <div className="form-group pb-2 input-group-lg">
          <input
            type="password"
            className="form-control"
            placeholder="* CVV/CVC"
            name="ccv"
            value={ccv}
            onChange={(e) => onChange(e)}
            maxLength="3"
            minLength="3"
            required
          />
        </div>
        <div className="form-group pb-2 input-group-lg">
          <input
            type="text"
            className="form-control"
            placeholder="* Card Holder Name"
            name="cardHolderName"
            value={cardHolderName}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input type="submit" className="form-control btn btn-primary" value="Submit" />
        </div>
      </form>
    </div>
  );
};

AddPayment.propTypes = {
  addPayment: PropTypes.func.isRequired,
};

export default connect(null, { addPayment })(AddPayment);
