import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../../Modal/Modal";
import "../Product.css";
import PropTypes from "prop-types";

// redux
import { connect } from "react-redux";
import { setAlert } from "../../redux/actions/alert";
import { toggleModal } from "../../redux/actions/modal";
import { updateLike } from "../../redux/actions/product";
import { addToCart, updateToCart, toggleCart, deleteCartItem } from "../../redux/actions/cart";
import Comment from "./Comment";

const ProductLoader = ({
  auth: { admin, user, isAuthenticated },
  product,
  commentLoading,
  cart: { products },
  updateLike,
  addToCart,
  updateToCart,
  toggleCart,
  toggleModal,
  deleteCartItem,
  setAlert,
}) => {
  // Setting the local cart fields
  const [cartState, setCartState] = useState({
    color: "",
    quantity: 1,
  });

  cartState.totalCost = product.itemPrice ? product.itemPrice * cartState.quantity : null;
  const { color, quantity, totalCost } = cartState;

  // At the load, setting the color & quantity fields from the cart
  useEffect(() => {
    if (products && products.length > 0) {
      const cartObj = products.filter((cart) => cart.product === product._id)[0];
      if (cartObj) {
        setCartState((state) => ({
          ...state,
          color: cartObj.selectedColor ? cartObj.selectedColor : "",
          quantity: cartObj.selectedQuantity ? cartObj.selectedQuantity : 1,
        }));
      }
      return;
    }
  }, [products, product._id]);

  // toggle Modal
  const toggleImageModal = (e) => {
    e.preventDefault();
    const img = e.target.getAttribute("src");
    toggleModal(img);
  };

  // update cartState
  const cartStateChang = (e) => {
    setCartState({ ...cartState, [e.target.name]: e.target.value });
  };

  //   Add To Cart
  const addProductToCart = (e) => {
    e.preventDefault();
    // setting cart product field
    let cartDataProduct = {
      cartProduct: {},
    };
    // cartDataProduct.cartProduct = product;
    if (color === "") {
      setAlert("Must select a color", "warning");
    } else {
      cartDataProduct.cartProduct.product = product._id;
      cartDataProduct.cartProduct.selectedColor = color;
      cartDataProduct.cartProduct.selectedQuantity = quantity;
      cartDataProduct.cartProduct.selectedTotalCost = totalCost;
      addToCart(cartDataProduct);
    }
  };
  //   Update Product to Cart
  const updateProductToCart = (e) => {
    e.preventDefault();
    // setting cart product field
    let cartDataProduct = {
      cartProduct: {},
    };
    if (color === "") {
      setAlert("Must select a color", "warning");
    } else {
      cartDataProduct.cartProduct.product = product._id;
      cartDataProduct.cartProduct.selectedColor = color;
      cartDataProduct.cartProduct.selectedQuantity = quantity;
      cartDataProduct.cartProduct.selectedTotalCost = totalCost;
      updateToCart(cartDataProduct);
    }
  };

  // Delete Product From Cart
  const deleteFromCart = (e, prd_id) => {
    e.preventDefault();
    deleteCartItem(prd_id);
  };

  // Update like, add or remove
  const updateProductLike = (e, id) => {
    e.preventDefault();
    if (id) {
      updateLike(id);
    }
  };
  const checkedValue = document.querySelector(".form-check-input");
  if (checkedValue && checkedValue.value === color) {
    checkedValue.setAttribute("checked", "checked");
  }
  return (
    <div>
      {/* If Logged in as admin */}
      {admin && admin._id && (
        <p className="py-2 text-white">
          Edit this product, *admin privilages only{"  "}
          <Link to={`/editproduct/${product._id}`} className="text-decoration-none">
            <i className="fas fa-arrow-circle-right"></i> Edit The Product of :- {product.itemName}
          </Link>
        </p>
      )}
      {/* End If Logged in as admin */}
      <p className="py-2 text-white">
        Back to products{"  "}
        <Link to="/" className="text-decoration-none">
          <i className="fas fa-arrow-circle-left"></i> Products
        </Link>
      </p>
      <div className="row description-1 py-2">
        {/* Item Images */}
        <div className="col-md-6 card-1">
          {/* Main Item Image */}
          <img
            className="card-img cursor-pointer img-fluid"
            src={product.itemImages.mainImage}
            alt="Preview"
            onClick={(e) => toggleImageModal(e)}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          />
          <hr />
          {/* End Main Item Image */}
          {/* Description Images */}
          <div className="d-flex flex-row bd-highlight mb-3" style={{ overflow: "auto" }}>
            {product.itemImages.descriptionImages.length > 0 &&
              product.itemImages.descriptionImages.map((desImage, index) => (
                <div className="p-2 bd-highlight descImages" key={index}>
                  <img
                    src={desImage}
                    alt="Preview"
                    className="cursor-pointer desc-img"
                    style={{ height: "100px", width: "100px", padding: "2px", margin: "5px 5px" }}
                    onClick={(e) => toggleImageModal(e)}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    //   onMouseOver={() => (style.color = "#0F0")}
                  />
                </div>
              ))}
          </div>
          {/* End Description Images */}
        </div>
        {/* End Item Images */}
        {/* Item Details */}
        <div className="col-md-6 card-2">
          {/* Item Primary Desc. */}
          <div className="card-body">
            <h3 className="card-title">{product.itemName}</h3>
            {product.itemBrand === "" && product.itemBrand === "Unknown" ? (
              <h6 className="card-subtitle text-muted mb-1">Brand Unknown</h6>
            ) : (
              <h6 className="card-subtitle text-muted mb-1">Brand {product.itemBrand}</h6>
            )}
            <div className="card-text">
              <h6 className="card-subtitle text-muted d-block mb-1">Category {product.itemCategory}</h6>
              <span className="text-muted d-block">{product.itemDescription}</span>
            </div>
          </div>
          {/* End Item Primary Desc. */}
          {/* Item Secondary Desc. as list */}
          <ul className="list-group list-group-flush card-text">
            {/* Select Available Color */}
            <li className="list-group-item">
              <h6 className="card-subtitle text-muted mb-1">Available Colors</h6>
              <div className="d-flex flex-row bd-highlight mb-3" style={{ overflow: "auto", maxWidth: "90%" }}>
                {product.itemColors &&
                  product.itemColors.map((color, index) => (
                    <div className="form-check mx-1 my-2 text-center" key={index}>
                      <input className="form-check-input" type="radio" name="color" value={color} onChange={(e) => cartStateChang(e)} id={`${index}`} />
                      <label
                        className={`form-check-label d-flex align-items-stretch color-${color.toLowerCase()} text-center`}
                        htmlFor={`${index}`}
                        style={{ width: "70px", height: "50px" }}
                      >
                        {/* <span className="d-block">{color}</span> */}
                      </label>
                    </div>
                  ))}
              </div>
              <small className="text-primary">* to order you must select a color</small>
            </li>
            {/* End Select Available Color */}
            {/* Item Price */}
            <li className="list-group-item">
              <h6 className="card-subtitle text-muted mb-1 d-inline-flex">Price </h6> <span className="itemPrice">${product.itemPrice}</span>
            </li>
            {/* End Item Price */}
            {/* Product Status */}
            <li className="list-group-item">
              <h6 className="card-subtitle text-muted mb-1 d-inline-flex">Product Status </h6>{" "}
              {product.status && product.status === "Upcoming" && (
                <span className="text-primary text-italic">
                  <i className="fas fa-dot-circle"></i> Upcoming
                </span>
              )}
              {product.status && product.status === "Available" && (
                <span className="text-success text-italic">
                  <i className="fas fa-dot-circle"></i> In Stock
                </span>
              )}
              {product.status && product.status !== "Upcoming" && product.status !== "Available" && (
                <span className="text-danger text-italic">
                  <i className="fas fa-dot-circle"></i> Out of Stock
                </span>
              )}
            </li>
            {/* End Product Status */}
            {/* Add Item Quantity */}
            <li className="list-group-item">
              <div className="col-md-6 my-3">
                <h6 className="card-subtitle text-muted mb-1 d-inline-flex">Add Quantity </h6> <br />
                <div className="input-group mb-3">
                  {/* Increase quantity */}
                  <button
                    className="btn btn-outline-success icon-button quantityBtn"
                    type="button"
                    onClick={(e) =>
                      quantity < product.itemQuantity
                        ? setCartState({
                            ...cartState,
                            quantity: cartState.quantity + 1,
                            totalCost: product.itemPrice ? product.itemPrice * cartState.quantity : null,
                          })
                        : setAlert("Quantity max exceeded", "danger")
                    }
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                  <input type="number" className="form-control text-center" name="quantity" value={quantity} disabled />
                  {/* decrease quantity */}
                  <button
                    className="btn btn-outline-danger icon-button quantityBtn"
                    type="button"
                    onClick={(e) =>
                      quantity > 1
                        ? setCartState({
                            ...cartState,
                            quantity: cartState.quantity - 1,
                            totalCost: product.itemPrice ? product.itemPrice * cartState.quantity : null,
                          })
                        : setAlert("Keep quantity at least 1", "danger")
                    }
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                </div>
              </div>
            </li>
            {/* End Add Item Quantity */}
            {/* Item Total Price */}
            <li className="list-group-item">
              <h6 className="card-subtitle text-muted mb-1 d-inline-flex">Total Cost </h6> <span className="itemPrice">${quantity * product.itemPrice}</span>
            </li>
            {/* End Item Total Price */}
            {/* Like product */}
            <li className="list-group-item mt-2">
              {user && product.likes && product.likes.filter((like) => like.user === user._id).length > 0 ? (
                <span className="cursor-pointer" onClick={(e) => updateProductLike(e, product._id)}>
                  <h6 className="card-subtitle text-muted mb-1 d-inline-flex">Unlike this product </h6> <i className="fas fa-heart text-danger fs-4"></i>
                </span>
              ) : user ? (
                <span className="cursor-pointer" onClick={(e) => updateProductLike(e, product._id)}>
                  <h6 className="card-subtitle text-muted mb-1 d-inline-flex">Like this product </h6> <i className="far fa-heart text-danger fs-4"></i>
                </span>
              ) : (
                <span>
                  <h6 className="card-subtitle text-muted mb-1 d-inline-flex">People Liked this product </h6> <i className="fas fa-heart text-danger fs-4"></i>
                </span>
              )}
              <sup>
                <span className="position-absolute translate-middle badge rounded-pill bg-danger">
                  {product.likes.length > 0 ? product.likes.length : product.likes.length}
                </span>
              </sup>
            </li>
            {/* End like product */}
          </ul>
          {/* End Item Secondary Desc. as list */}
          {/* Checking Authenticated User or Not */}
          {
            isAuthenticated && user ? (
              // if authenticated
              // Checking if the product already exist in the user cart
              products && products.filter((cart) => cart.product === product._id).length > 0 ? (
                // if exist then  ..>
                <div className="row p-3 text-white text-center mt-3">
                  {/* Update */}
                  <div className="col col-lg-3 shoe-admin cursor-pointer mx-2 py-3" onClick={(e) => updateProductToCart(e)}>
                    <span className="text-uppercase">Update Cart</span>
                  </div>
                  {/*End Update */}

                  {/* View Cart */}
                  <div className="col col-lg-3 shoe-login cursor-pointer mx-2 py-3" onClick={() => toggleCart()}>
                    <span className="text-uppercase">View Cart</span>
                  </div>
                  {/* End View Cart */}

                  {/* Remove from cart */}
                  <div className="col col-lg-3 shoe cursor-pointer mx-2 py-3" onClick={(e) => deleteFromCart(e, product._id)}>
                    <span className="text-uppercase">Remove Cart</span>
                  </div>
                  {/* End Remove from cart */}
                </div>
              ) : // End if exist then..
              // End Checking if the product already exist in the user cart
              // if not exist then ..>
              // checking product current status // Available or not available
              product.status && product.status !== "Available" ? (
                // if not available
                <div className="addCartError p-3 text-white text-center mt-3 cursor-pointer col col-lg-4">
                  <span className="text-uppercase">Currently Not Available</span>
                </div>
              ) : (
                // End if not available
                // if available
                <div className="shoe p-3 text-white text-center mt-3 cursor-pointer col col-lg-4" onClick={(e) => addProductToCart(e)}>
                  <span className="text-uppercase">Add to cart</span>
                </div>
                // End if available
              )
            ) : // End checking product current status // Available or not available
            // End if not exist then
            // end if authenticated
            // if authenticated by admin
            admin ? (
              // admin authenticated
              <div className="shoe-admin p-3 text-center mt-3 cursor-pointer">
                <span className="text-uppercase text-white">Admin Can't Buy!</span>
              </div>
            ) : (
              // End admin authenticated

              // No admin no user
              <Link to="/login" className="text-decoration-none">
                <div className="shoe-login p-3 text-center mt-3 cursor-pointer col col-lg-4">
                  <span className="text-uppercase text-white">Log in to buy</span>
                </div>
              </Link>
              // End No admin no user
            )
            // End if authenticated by admin
          }
          {/* End Checking Authenticated User or Not -- 1  */}
        </div>
        {/* End Item Details */}
        <hr className="mt-2 mb-3" />
        {/* Post a comment */}
        <div className="col-md-8 card-2">
          <Comment user={user} product={product} />
        </div>
        {/* End post a comment */}
      </div>
      <Modal />
    </div>
  );
};

ProductLoader.propTypes = {
  updateLike: PropTypes.func.isRequired,
  toggleCart: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  updateToCart: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  deleteCartItem: PropTypes.func.isRequired,
};

export default connect(null, { updateLike, toggleCart, addToCart, updateToCart, toggleModal, deleteCartItem, setAlert })(ProductLoader);
