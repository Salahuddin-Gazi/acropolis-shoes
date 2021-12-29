import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Spinner from "../Spinner/Spinner";
import PropTypes from "prop-types";
import "./Cart.css";

// redux
import { connect } from "react-redux";
// import { getProducts } from "../redux/actions/product";
import { updateToCart, toggleCart, deleteCartItem, deleteCart } from "../redux/actions/cart";
import { setAlert } from "../redux/actions/alert";

const TemporaryDrawer = ({ cart: { cart, isHidden, loading }, products, updateToCart, toggleCart, deleteCartItem, deleteCart, setAlert }) => {
  const toggleDrawer = () => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    toggleCart();
  };

  // Delete Product From Cart
  const deleteFromCart = (e, prd_id) => {
    e.preventDefault();
    deleteCartItem(prd_id);
  };

  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (cart.products) {
      const sum = cart.products.reduce((countCost, count) => (countCost += count.selectedTotalCost), 0);
      setTotalCost(sum);
    }
    // getProducts();
  }, [cart.products]);

  // Update Cart Item Quantity
  const updateCartQuantity = (e, cart, increase = false) => {
    e.preventDefault();

    const isFound = products ? products.filter((prod) => prod._id === cart.product)[0] : false;
    let cartDataProduct = {
      cartProduct: {},
    };

    cartDataProduct.cartProduct = cart;
    let { cartProduct } = cartDataProduct;
    if (increase && isFound) {
      if (isFound.itemQuantity > cartProduct.selectedQuantity) {
        cartProduct.selectedQuantity += 1;
      } else {
        setAlert("Quantity max exceeded", "danger");
        return;
      }
      cartProduct.selectedTotalCost = cartProduct.selectedQuantity * isFound.itemPrice;
      updateToCart(cartDataProduct);
      return;
    }
    if (!increase && isFound) {
      if (cartProduct.selectedQuantity > 1) {
        cartProduct.selectedQuantity -= 1;
      } else {
        setAlert("Keep quantity at least 1", "danger");
        return;
      }
      cartProduct.selectedTotalCost = cartProduct.selectedQuantity * isFound.itemPrice;
      updateToCart(cartDataProduct);
      return;
    }
    setAlert("Something went wrong", "danger");
  };

  const Navigate = useNavigate();

  const list = () =>
    loading ? (
      <Spinner />
    ) : (
      <Fragment>
        <h2 className="p-2 mt-2 mb-2 mx-3 text-center">
          My Cart <i className="fas fa-cart-arrow-down"></i>
        </h2>
        <div className="d-flex justify-content-center mb-2">
          <button type="button" className="btn btn-outline-dark" style={{ maxWidth: "150px" }} onClick={toggleDrawer()}>
            Dismiss
          </button>
        </div>
        {cart.products && cart.products.length > 0 && products.length > 0 ? (
          <Fragment>
            {cart.products.map((cart) => {
              return (
                <Fragment key={cart.product}>
                  <div className="card" style={{ maxWidth: "320px", minWidth: "300px" }}>
                    <img
                      src={products.filter((prod) => prod._id === cart.product)[0].itemImages.mainImage}
                      className="card-img-top rounded-circle mx-auto d-block mt-2 cursor-pointer cardAvatarImg"
                      alt="..."
                      style={{ width: "55px", height: "55px" }}
                      onClick={() => Navigate(`/product/${cart.product}`)}
                    />
                    <div className="card-body">
                      <h5 className="card-title text-truncate">{products.filter((prod) => prod._id === cart.product)[0].itemName}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">Color Selected {cart.selectedColor}</h6>
                      <ul className="list-group">
                        <li className="list-group-item">
                          {" "}
                          <div className="fw-normal">
                            Quantity{" "}
                            <button className="btn quantityBtn" onClick={(e) => updateCartQuantity(e, cart, true)}>
                              <i className="fas fa-angle-double-up"></i>
                            </button>
                            <span className="itemPrice">{cart.selectedQuantity}</span>
                            <button className="btn quantityBtn" onClick={(e) => updateCartQuantity(e, cart)}>
                              <i className="fas fa-angle-double-down"></i>
                            </button>
                          </div>
                        </li>
                        <li className="list-group-item">
                          {" "}
                          <div style={{ display: "block" }}>
                            Total Cost <span className="itemPrice">${cart.selectedTotalCost}</span>
                          </div>
                        </li>
                        <li className="list-group-item">
                          <button className="btn btn-danger" onClick={(e) => deleteFromCart(e, cart.product)}>
                            <i className="fas fa-trash-alt"></i> Remove
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Fragment>
              );
            })}
            <div className="card" style={{ maxWidth: "20rem" }}>
              <div className="card-body">
                <div className="my-2 mx-2">
                  Total Checkout Cost: <span className="itemPrice">${totalCost}</span>
                </div>
                <ul className="list-group">
                  <li className="list-group-item">
                    {" "}
                    <div>
                      <button
                        className="btn btn-success mx-2"
                        onClick={() => {
                          Navigate(`cart/orders`);
                          toggleCart();
                        }}
                      >
                        🛒 Checkout
                      </button>
                    </div>
                  </li>
                  <li className="list-group-item">
                    {" "}
                    <div>
                      <button
                        className="btn btn-danger mx-2"
                        onClick={() => {
                          deleteCart();
                          Navigate(-1);
                        }}
                      >
                        🗑 Delete Cart
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Fragment>
        ) : (
          <div className="card" style={{ maxWidth: "20rem" }}>
            <div className="card-body">
              <h5 className="card-title">Please Add Some Products To Cart !</h5>
            </div>
          </div>
        )}
      </Fragment>
    );

  return (
    <div>
      {/* <Button onClick={toggleDrawer()}>right</Button> */}
      <Drawer anchor="right" open={!isHidden} onClose={toggleDrawer()}>
        {list()}
      </Drawer>
    </div>
  );
};

TemporaryDrawer.propTypes = {
  updateToCart: PropTypes.func.isRequired,
  toggleCart: PropTypes.func.isRequired,
  deleteCart: PropTypes.func.isRequired,
  deleteCartItem: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  // getProducts: PropTypes.func.isRequired,
  cart: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  products: state.product.products,
});

export default connect(mapStateToProps, { updateToCart, toggleCart, deleteCartItem, deleteCart, setAlert })(TemporaryDrawer);
