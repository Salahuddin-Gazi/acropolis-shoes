import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import FileBase64 from "react-file-base64";
import PropTypes from "prop-types";

// redux
import { connect } from "react-redux";
import { createProduct, getProducts } from "../redux/actions/product";
import { setAlert } from "../redux/actions/alert";

const AddProduct = ({ createProduct, getProducts, setAlert }) => {
  const Navigate = useNavigate();
  // Using React Hook
  const [formData, setFromData] = useState({
    status: "",
    itemName: "",
    itemBrand: "",
    itemDescription: "",
    itemPrice: "",
    itemQuantity: "",
    itemColors: "",
    itemCategory: "",
    descriptionImages: [],
    mainImage: "",
  });
  const { status, itemName, itemBrand, itemDescription, itemPrice, itemQuantity, itemColors, itemCategory, descriptionImages, mainImage } = formData;

  // image state
  const [image, toggleImage] = useState({
    poster: false,
    desc: false,
  });
  const { poster, desc } = image;
  const onChange = (e) => {
    setFromData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (mainImage) {
      createProduct(formData);
      getProducts();
      Navigate("/", { replace: true });
    } else {
      setAlert("Fill the required fields", "warning");
    }
  };
  return (
    <Fragment>
      <p className="py-2 text-white">
        Back to products{"  "}
        <Link to="/" className="text-decoration-none">
          <i className="fas fa-arrow-circle-left"></i> Products
        </Link>
      </p>
      <h1 className="large text-primary">Add Product, Admin</h1>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group col-md-8 py-3 input-group-lg">
          <select name="status" className="form-select" value={status} onChange={(e) => onChange(e)} required>
            <option value="0">*Select Product Status</option>
            <option value="Available">Available</option>
            <option value="Not available">Not available</option>
            <option value="Upcoming">Upcoming</option>
          </select>
          <small className="form-text">Give us an idea of the product status.</small>
        </div>
        <div className="form-group col-md-8 pb-3 input-group-lg">
          <input type="text" className="form-control" placeholder="*Product Name" name="itemName" value={itemName} required onChange={(e) => onChange(e)} />
          <small className="form-text">Could be the straight product name or a descriptive name.</small>
        </div>
        <div className="form-group col-md-8 pb-3 input-group-lg">
          <input type="text" className="form-control" placeholder="Barand Name" name="itemBrand" value={itemBrand} onChange={(e) => onChange(e)} />
          <small className="form-text">Default Unknown.</small>
        </div>
        <div className="form-group col-md-8 pb-3 input-group-lg">
          <input
            type="text"
            className="form-control"
            placeholder="*Colors Available"
            name="itemColors"
            value={itemColors}
            required
            onChange={(e) => onChange(e)}
          />
          <small className="form-text">Use comma separtaor to input multiple colors type.</small>
        </div>
        <div className="form-group col-md-8 pb-3 input-group-lg">
          <input
            type="number"
            className="form-control"
            placeholder="*Price per Unit"
            name="itemPrice"
            value={itemPrice}
            required
            onChange={(e) => onChange(e)}
          />
          <small className="form-text">Insert price equivalent to $.</small>
        </div>
        <div className="form-group col-md-8 pb-3 input-group-lg">
          <input
            type="number"
            className="form-control"
            placeholder="*Product Available Quantity"
            name="itemQuantity"
            value={itemQuantity}
            required
            onChange={(e) => onChange(e)}
          />
          <small className="form-text">Available Quantity.</small>
        </div>
        <div className="form-group col-md-8 pb-3 input-group-lg">
          <input
            type="text"
            className="form-control"
            placeholder="*Product Category"
            name="itemCategory"
            value={itemCategory}
            required
            onChange={(e) => onChange(e)}
          />
          <small className="form-text">Supports only one category.</small>
        </div>
        {/* Update poster/mainImage */}
        <div className="form-group col-md-8 pb-3 input-group-lg">
          <div className="card card-body my-2" style={{ overflow: "hidden" }}>
            <div>
              {mainImage ? (
                <Fragment>
                  <label className="text-muted d-block">Currently Selected Poster Image</label>
                  <img
                    src={mainImage}
                    alt="Prev."
                    style={{ maxHeight: "150px", maxWidth: "150px", display: "block", border: "10px", padding: "2px", margin: "5px" }}
                  />
                </Fragment>
              ) : (
                <Fragment>
                  <label className="text-muted d-block">Update Poster Image</label>
                </Fragment>
              )}
              {!poster && (
                <button
                  className="btn btn-dark mt-1"
                  style={{ maxHeight: "150px", maxWidth: "150px", display: "block", border: "10px" }}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleImage({ ...image, poster: !image.poster });
                  }}
                >
                  Update
                </button>
              )}
            </div>
            {poster ? (
              <div id="img" className="form-control quantityBtn d-block mt-1">
                <small className="d-block text-primary mb-1">Not more than 5MB</small>
                <FileBase64
                  name="avatarImage"
                  type="image"
                  multiple={false}
                  onDone={(file) => {
                    if (file.type.slice(0, 5) === "image") {
                      setFromData({ ...formData, mainImage: file.base64 });
                      toggleImage({ ...image, poster: !image.poster });
                    } else {
                      setFromData({ ...formData, mainImage: null });
                      setAlert("Select Only Image", "warning");
                    }
                  }}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        {/* Update desciptions images */}
        <div className="form-group col-md-8 pb-3 input-group-lg">
          <div className="card card-body my-2" style={{ overflow: "hidden" }}>
            {descriptionImages.length > 0 ? (
              <Fragment>
                <label className="text-muted d-block">Selected description images:</label>
                <div className="d-flex flex-row bd-highlight mb-3" style={{ overflow: "auto" }}>
                  {descriptionImages.map((descImg, index) => (
                    <div className="p-2 bd-highlight descImages" key={index}>
                      <img
                        src={descImg}
                        alt="Prev..."
                        style={{ height: "150px", width: "150px", border: "10px", padding: "2px", margin: "5px 5px" }}
                        className="descImage"
                      />
                      <div
                        className="descOverlay"
                        onClick={() => {
                          let index = descriptionImages.indexOf(descImg);
                          if (index >= 0) {
                            descriptionImages.splice(index, 1);
                            setFromData({ ...formData, descriptionImages: descriptionImages });
                          }
                        }}
                      >
                        <i className="fas fa-times cursor-pointer descIcon"></i>
                      </div>
                    </div>
                  ))}
                </div>
              </Fragment>
            ) : (
              <label htmlFor="img" className="text-muted d-block">
                Select description image:
              </label>
            )}
            {!desc && (
              <button
                className="btn btn-dark mt-1"
                style={{ maxHeight: "150px", maxWidth: "150px", display: "block", border: "10px" }}
                onClick={(e) => {
                  e.preventDefault();
                  toggleImage({ ...image, desc: !image.desc });
                }}
              >
                ADD
              </button>
            )}
            {desc && (
              <div id="img" className="form-control quantityBtn d-block mt-1">
                <small className="d-block text-primary mb-1">Not more than 5MB, each</small>
                <FileBase64
                  name="avatarImage"
                  placeholder="Choose Images"
                  type="image"
                  multiple={false}
                  onDone={(file) => {
                    if (file.type.slice(0, 5) === "image") {
                      formData.descriptionImages.unshift(file.base64);
                      toggleImage({ ...image, desc: !image.desc });
                    } else {
                      setAlert("Select Only Image", "warning");
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-group col-md-8 pb-3 input-group-lg">
          <textarea
            type="text"
            className="form-control"
            placeholder="*Product Description"
            name="itemDescription"
            value={itemDescription}
            required
            onChange={(e) => onChange(e)}
          />
          <small className="form-text">Describe the product.</small>
        </div>
        <div className="form-group col-md-8">
          <input type="submit" className="form-control btn btn-primary text-uppercase" value="Add product" />
        </div>
      </form>
    </Fragment>
  );
};

AddProduct.propTypes = {
  createProduct: PropTypes.func.isRequired,
  getProducts: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default connect(null, { createProduct, getProducts, setAlert })(AddProduct);
