import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

// redux
import { connect } from "react-redux";
import { addAddress, getProfile } from "../../redux/actions/profile";

const AddAddress = ({ addAddress, getProfile }) => {
  // Using React Hook
  const [formData, setFormData] = useState({
    _id: uuidv4(),
    address: "",
    area: "",
    city: "",
    region: "",
    phone: "",
    description: "",
  });
  const { address, area, city, region, phone, description } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addAddress(formData);
  };
  return (
    <div>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <small>* marks need to be flled.</small>
        <div className="form-group py-2 input-group-lg">
          <input type="text" className="form-control" placeholder="* Address" name="address" value={address} onChange={(e) => onChange(e)} required />
        </div>
        <div className="form-group pb-2 input-group-lg">
          <input type="text" className="form-control" placeholder="Area" name="area" value={area} onChange={(e) => onChange(e)} />
        </div>
        <div className="form-group pb-2 input-group-lg">
          <input type="text" className="form-control" placeholder="* City" name="city" value={city} onChange={(e) => onChange(e)} required />
        </div>
        <div className="form-group pb-2 input-group-lg">
          <input type="text" className="form-control" placeholder="Region" name="region" value={region} onChange={(e) => onChange(e)} />
        </div>
        <div className="form-group pb-2 input-group-lg">
          <input type="tel" className="form-control" placeholder="* Phone" name="phone" value={phone} onChange={(e) => onChange(e)} required />
        </div>
        <div className="form-group pb-2 input-group-lg">
          <textarea
            type="text"
            className="form-control"
            placeholder="Description"
            name="description"
            value={description}
            onChange={(e) => onChange(e)}
            maxLength={"30"}
          />
        </div>
        <div className="form-group">
          <input type="submit" className="form-control btn btn-primary" value="Submit" />
        </div>
      </form>
    </div>
  );
};

AddAddress.propTypes = {
  addAddress: PropTypes.func.isRequired,
  getProfile: PropTypes.func.isRequired,
};

export default connect(null, { addAddress, getProfile })(AddAddress);
