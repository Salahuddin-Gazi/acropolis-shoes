import React from "react";
import { useNavigate } from "react-router";
import "./ItemLoader.css";
import PropTypes from "prop-types";

const ItemLoader = ({ product }) => {
  const { itemImages, status, itemName, itemBrand, itemDescription, itemPrice, _id } = product;
  const Navigate = useNavigate();
  return (
    <div className="col-xl-4 col-md-6 col-12 cursor" onClick={() => Navigate(`/product/${_id}`)}>
      <div className="card card-itemLoader mt-3">
        <div className="align-items-center text-center  product">
          <img src={itemImages.mainImage} alt="Preview" className="rounded-circle mx-auto mt-2 mb-2" width="200" height="190" />
          <h5 className="name text-truncate px-4">{itemName}</h5>
          {itemBrand !== "Unknown" ? <h3>{itemBrand}</h3> : <h3 className="text-white">Unknown</h3>}
          {/* card info */}
          <p className="text text-truncate mt-3 px-3">{itemDescription}</p>
          {/* Add price */}
          <div className="cost mt-3 text-dark">
            <span>${itemPrice}</span>
          </div>
          {/* Add Status */}
          <div className="status mt-1 text-end px-3">
            {status && status === "Upcoming" && (
              <span className="text-primary text-italic">
                <i className="fas fa-dot-circle"></i> Upcoming
              </span>
            )}
            {status && status === "Available" && (
              <span className="text-success text-italic">
                <i className="fas fa-dot-circle"></i> In Stock
              </span>
            )}
            {status && status !== "Upcoming" && status !== "Available" && (
              <span className="text-danger text-italic">
                <i className="fas fa-dot-circle"></i> Out of Stock
              </span>
            )}
          </div>
          {/* card button */}
          {status && status !== "Available" ? (
            <div className="addCartError cursor p-3 text-white text-center mt-3">
              <span className="text-uppercase">Not Available</span>
            </div>
          ) : (
            <div className="addCart cursor p-3 text-white text-center mt-3">
              <span className="text-uppercase">Add to cart</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ItemLoader.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ItemLoader;
