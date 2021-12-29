import React, { useState } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import Spinner from "../Spinner/Spinner";
import OrderedModal from "../Modal/OrderedModal";
import OrderPlaced from "./OrderPlaced.jpg";
import AddAddress from "../Profile/components/AddAddress";
import AddPayment from "../Profile/components/AddPayment";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

// redux
import { connect } from "react-redux";
import { updateToCart, deleteCartItem, deleteCart } from "../redux/actions/cart";
import { setAlert } from "../redux/actions/alert";
import { addOrder, toggleUserAddress, toggleUserPayment } from "../redux/actions/profile";
import { toggleModal } from "../redux/actions/modal";

const Order = ({
  cart: { cart, loading },
  profile: { addressBook, payments, toggleAddress, togglePayment },
  products,
  updateToCart,
  deleteCartItem,
  deleteCart,
  setAlert,
  addOrder,
  toggleUserAddress,
  toggleUserPayment,
  toggleModal,
}) => {
  // data fields oreders
  const [orderFields, setOrderFields] = useState({
    _id: uuidv4(),
    selectedContact: "",
    selectedPayment: "",
    selectedPickup: "",
    totalCost: "",
  });

  let count = 0;
  let totalCheckoutCost = 0;

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

  // Delete Product From Cart
  const deleteFromCart = (e, prd_id) => {
    e.preventDefault();
    deleteCartItem(prd_id);
  };

  // Pickup State
  const [homeDelivery, setHomeDelivery] = useState(0);
  const onChangePickup = (e) => {
    if (e.target.value === "homeDelivery") {
      setHomeDelivery(25);
      setOrderFields({
        ...orderFields,
        selectedPickup: "Home Delivery",
        totalCost: totalCheckoutCost + 25,
      });
    } else {
      setHomeDelivery(0);
      setOrderFields({
        ...orderFields,
        selectedPickup: "Pickup",
        totalCost: totalCheckoutCost,
      });
    }
  };

  const onChange = (e) => {
    setOrderFields({
      ...orderFields,
      [e.target.name]: e.target.value,
    });
  };

  // toggle Modal
  const toggleImageModal = (img) => {
    toggleModal(img);
  };

  let { selectedContact, selectedPayment, selectedPickup } = orderFields;
  const onSubmit = (e) => {
    e.preventDefault();
    if (cart.products && cart.products.length > 0) {
      orderFields.products = cart.products;
      toggleImageModal(OrderPlaced);
      addOrder(orderFields);
      deleteCart();
      return;
    }
  };

  return loading ? (
    <Spinner />
  ) : (
    <div>
      <p className="py-2 text-white">
        Back to products{"  "}
        <Link to="/" className="text-decoration-none">
          <i className="fas fa-arrow-circle-left"></i> Products
        </Link>
      </p>
      <div className="bg-white mt-10 p-5">
        {cart.products && cart.products.length !== 0 && products.length > 0 ? (
          <div>
            <p className="lead fw-bold">Products in cart {"->>"}</p>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Cost</th>
                </tr>
              </thead>
              <tbody>
                {cart &&
                  cart.products &&
                  cart.products.map((cart) => {
                    count += 1;
                    totalCheckoutCost += cart.selectedTotalCost;
                    return (
                      <tr key={cart.product} className="cart-content bg-gradient">
                        <th scope="row">{count}</th>
                        <td className="col-md-8">
                          <Link to={`/product/${cart.product}`} className="text-decoration-none text-dark">
                            {products.filter((prod) => prod._id === cart.product)[0].itemName}
                          </Link>
                          <div className="mt-2">
                            <button className="btn quantityBtn" onClick={(e) => updateCartQuantity(e, cart, true)}>
                              <i className="fas fa-angle-double-up"></i>
                            </button>
                            <span className="itemPrice">{cart.selectedQuantity}</span>
                            <button className="btn quantityBtn" onClick={(e) => updateCartQuantity(e, cart)}>
                              <i className="fas fa-angle-double-down"></i>
                            </button>
                            <button className="btn btn-danger ms-1" onClick={(e) => deleteFromCart(e, cart.product)}>
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                        <td className="align-middle">{`$${cart.selectedTotalCost}`}</td>
                      </tr>
                    );
                  })}
                <tr className="cart-content bg-gradient">
                  <th scope="row">{count + 1}</th>
                  <td>
                    <p className="my-2 fs-5">Choose your pickup</p>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="deliveryMethod"
                        value="homeDelivery"
                        id="selectedShipmentHome"
                        onChange={(e) => onChangePickup(e)}
                      />
                      <label className="form-check-label d-flex align-items-stretch mb-2" htmlFor="selectedShipmentHome">
                        <div>
                          <span className="d-block">Home delivery</span>
                          <span className="d-block">Delivery charge $25</span>
                        </div>
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="deliveryMethod"
                        value="pickup"
                        id="selectedShipmentPickup"
                        onChange={(e) => onChangePickup(e)}
                      />
                      <label className="form-check-label d-flex align-items-stretch" htmlFor="selectedShipmentPickup">
                        <div>
                          <span className="d-block">Pick from a pickup point</span>
                          <span className="d-block">No delivery charge</span>
                        </div>
                      </label>
                    </div>
                  </td>
                  <td className="align-middle">{homeDelivery ? <span>${homeDelivery}</span> : <span>${0}</span>}</td>
                </tr>
                <tr className="bg-secondary bg-gradient text-white">
                  <th scope="row"></th>
                  <td>Total Checkout Cost</td>
                  <td className="align-middle">{homeDelivery ? `$${totalCheckoutCost + homeDelivery}` : `$${totalCheckoutCost}`}</td>
                </tr>
              </tbody>
            </table>

            {/* Contact & Payment */}
            <div className="row">
              {/* Contact info */}
              <div className="col col-md-6">
                {addressBook && addressBook.length > 0 ? (
                  <div>
                    <p className="my-2 fs-5">Choose your shipment address</p>
                    {addressBook.map((address) => (
                      <div className="form-check" key={address._id}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="selectedContact"
                          value={JSON.stringify(address)}
                          onChange={(e) => onChange(e)}
                          id={`${address._id}`}
                        />
                        <label className="form-check-label d-flex align-items-stretch" htmlFor={`${address._id}`} style={{ maxWidth: "85%" }}>
                          <div className="card card-body">
                            <div>
                              <span>{address.address}</span> <span>{address.area}</span> <span>{address.city}</span>
                              <span>{address.region}</span>
                            </div>
                            <span className="d-block">{address.phone}</span>
                            <span className="d-block">{address.description}</span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="my-2 fs-5">Please add a contact info to place order</p>
                  </div>
                )}
                <div className="my-2" style={{ maxWidth: "80%" }}>
                  <div className="pt-1 mb-2">
                    <button type="button" className="btn btn-outline-success text-uppercase quantityBtn" onClick={() => toggleUserAddress()}>
                      Add Contact
                    </button>
                  </div>
                  {toggleAddress ? <AddAddress /> : ""}
                </div>
              </div>
              {/* End of contact info */}
              {/* Payment method */}
              <div className="col col-md-6">
                {payments && payments.length > 0 ? (
                  <div>
                    <p className="my-2 fs-5">Choose your payment method</p>
                    {payments.map((payment) => {
                      let cardNumber = payment.visa.toString().slice(-5);
                      return (
                        <div className="form-check" key={payment._id}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="selectedPayment"
                            value={JSON.stringify(payment)}
                            onChange={(e) => onChange(e)}
                            id={`${payment._id}`}
                          />
                          <label className="form-check-label d-flex align-items-stretch h-100" htmlFor={`${payment._id}`} style={{ maxWidth: "85%" }}>
                            <div className="card card-body">
                              <span>
                                <i className="fa-brands fa-cc-visa fs-3"></i> **** **** ****{cardNumber}
                              </span>
                              <div>
                                <span>
                                  <Moment format="MM/YY">{payment.expires}</Moment>
                                </span>
                                , <span>{payment.cardHolderName}</span>
                              </div>
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div>
                    <p className="my-2 fs-5">Please add a contact info to place order</p>
                  </div>
                )}
                <div className="my-2" style={{ maxWidth: "80%" }}>
                  <div className="pt-1 mb-2">
                    <button type="button" className="btn btn-outline-success text-uppercase quantityBtn" onClick={() => toggleUserPayment()}>
                      Add Payment
                    </button>
                  </div>
                  {togglePayment ? <AddPayment /> : ""}
                </div>
              </div>
              {/* End of payment method */}
            </div>
            {/* End Conatact & Payment */}
            <hr className="mt-2 mb-3" />
            {selectedPayment && selectedContact && selectedPickup ? (
              <div
                className="order-btn-hover p-3 text-white text-center mt-3 col-sm-12 col-md-12"
                type="submit"
                onClick={(e) => onSubmit(e)}
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                <span className="text-uppercase">Proceed To Order</span>
              </div>
            ) : (
              <div
                className="order-btn-hover p-3 text-white text-center mt-3 col-sm-12 col-md-12"
                type="submit"
                onClick={() => setAlert("Please select all options", "danger")}
              >
                <span className="text-uppercase">Proceed To Order</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white mt-10 p-5 fs-4">Add some products in cart to order</div>
        )}
      </div>
      <OrderedModal />
    </div>
  );
};

Order.propTypes = {
  cart: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
  setAlert: PropTypes.func.isRequired,
  // getCart: PropTypes.func.isRequired,
  addOrder: PropTypes.func.isRequired,
  updateToCart: PropTypes.func.isRequired,
  deleteCartItem: PropTypes.func.isRequired,
  deleteCart: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  products: state.product.products,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  // getCart,
  updateToCart,
  deleteCartItem,
  deleteCart,
  setAlert,
  addOrder,
  toggleUserAddress,
  toggleUserPayment,
  toggleModal,
})(Order);
