import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../Spinner/Spinner";
import Moment from "react-moment";
import AddAddress from "./components/AddAddress";
import AddPayment from "./components/AddPayment";
import "./Profile.css";
import FileBase64 from "react-file-base64";
import PropTypes from "prop-types";

// redux
import { connect } from "react-redux";
import { getProducts } from "../redux/actions/product";
import { getProfile, deleteAddress, deletePayment, toggleUserAddress, toggleUserPayment } from "../redux/actions/profile";
import { updateAvatar } from "../redux/actions/profile";

// MUI
import { Avatar, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import { setAlert } from "../redux/actions/alert";

const Profile = ({
  auth: { isAuthenticated, user },
  products,
  cart,
  profile: { loading, profileAvatarLoading, addressBook, orders, payments, toggleAddress, togglePayment, avatar },
  updateAvatar,
  toggleUserAddress,
  toggleUserPayment,
  getProducts,
  getProfile,
  deleteAddress,
  deletePayment,
  setAlert,
}) => {
  useEffect(() => {
    getProducts();
    getProfile();
  }, [getProducts, getProfile]);

  let liked = [];
  let commented = [];
  let showOrders = [...orders];
  showOrders.splice(5);
  // console.log(showOrders);

  if (user && products) {
    liked = products.filter((product) => product.likes.filter((like) => like.user === user._id).length > 0);
    commented = products.filter((product) => product.comments.filter((comment) => comment.user === user._id).length > 0);
  }

  // Update/Upload avatar
  const [toggleAvatarUpload, toggle] = useState(false);
  const [avatarImage, setAvatarImage] = useState({
    avatar: "",
  });
  // Update Avatar
  const updateUserAvatar = (e) => {
    e.preventDefault();
    toggle(!toggleAvatarUpload);
    updateAvatar(avatarImage);
  };

  // Avatar
  const stringToColor = (string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  };

  const stringAvatar = (name) => {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };

  // Color Icon Button
  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    "&:hover": {
      backgroundColor: purple[700],
    },
  }));

  // delete address by id
  const deleteUserAddress = (e, id) => {
    e.preventDefault();
    deleteAddress(id);
  };

  // delete payment by id
  const deleteUserPayment = (e, id) => {
    e.preventDefault();
    deletePayment(id);
  };

  // products.length > 0 ? console.log(products) : console.log("not arrived yet");

  return !isAuthenticated || loading ? (
    <Spinner />
  ) : (
    <div>
      <p className="py-2 text-white">
        Back to products{"  "}
        <Link to="/" className="text-decoration-none">
          <i className="fas fa-arrow-circle-left"></i> Products
        </Link>
      </p>
      <div style={{ backgroundColor: "white" }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-10">
              {user && (
                <>
                  <div>
                    <div className="flex-shrink-0 profileAvatarConatiner">
                      {profileAvatarLoading ? (
                        <div style={{ minWidth: "180px", minHeight: "180px", borderRadius: "10px", overflow: "hidden" }}>
                          <Spinner />
                        </div>
                      ) : avatar ? (
                        <Avatar
                          src={avatar}
                          alt="Generic placeholder image"
                          variant="square"
                          sx={{ minWidth: "180px", minHeight: "180px", borderRadius: "10px" }}
                          className="img-fluid profileAvatar"
                        />
                      ) : (
                        <Avatar
                          {...stringAvatar(user.name)}
                          alt="Generic placeholder image"
                          className="img-fluid profileAvatar"
                          style={{ minWidth: "180px", minHeight: "180px", borderRadius: "10px" }}
                        />
                      )}
                      <div className="overlay" style={{ borderRadius: "10px" }}>
                        <a href="#!" className="icon" title="Update">
                          <i
                            className="fa fa-camera"
                            onClick={() => {
                              toggle(!toggleAvatarUpload);
                            }}
                          ></i>
                        </a>
                      </div>
                    </div>
                    {toggleAvatarUpload ? (
                      <div className="card card-body my-2 col-md-6" style={{ overflow: "hidden" }}>
                        <form className="form" onSubmit={(e) => updateUserAvatar(e)}>
                          <div className="form-group">
                            <label htmlFor="img" className="text-muted d-block">
                              Select image:
                            </label>
                            <div id="img" className="form-control quantityBtn d-block mt-1">
                              <small className="d-block text-primary">Not more than 5MB</small>
                              <FileBase64
                                name="avatarImage"
                                type="image"
                                multiple={false}
                                onDone={(file) => {
                                  if (file.type.slice(0, 5) === "image") {
                                    setAvatarImage({ ...avatarImage, avatar: file.base64 });
                                    return;
                                  } else {
                                    setAvatarImage({ ...avatarImage, avatar: "" });
                                    setAlert("Select Only Image", "warning");
                                    return;
                                  }
                                }}
                              />
                            </div>
                            <button type="submit" className="btn btn-block btn-outline-primary my-2 quantityBtn">
                              Submit
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="flex-grow-1 mt-2">
                    <h5 className="mb-1">{user.name}</h5>
                    <p className="mb-2 pb-1" style={{ color: "#2b2a2a" }}>
                      Joined @<Moment format="DD MMMM YYYY">{user.date}</Moment>
                    </p>

                    <div className="d-flex justify-content-start rounded-3 p-2 mb-2" style={{ backgroundColor: "#efefef" }}>
                      <div>
                        <p className="small text-muted mb-1">Product</p>
                      </div>
                      <div className="px-3">
                        <p className="small text-muted mb-1">Liked</p>
                        <p className="mb-0">{liked.length}</p>
                      </div>
                      <div className="px-3">
                        <p className="small text-muted mb-1">Commented</p>
                        <p className="mb-0">{commented.length}</p>
                      </div>
                      <div>
                        <p className="small text-muted mb-1">Ordered</p>
                        <p className="mb-0">{orders.length}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="row">
                {/* Add Contact Info */}
                <div className="col-md-6">
                  <div className="card card-body">
                    <h5>Contacts</h5>
                    {addressBook && addressBook.length > 0 ? (
                      <ol className="list-group list-group-flush card-text">
                        {addressBook.map((address) => (
                          <li className="list-group-item" key={address._id}>
                            <div>
                              <span>{address.address}</span> <span>{address.area}</span> <span>{address.city}</span>
                              <span className="d-block">{address.region}</span>
                              <span className="d-block">{address.phone}</span>
                              <span className="d-block">{address.description}</span>
                            </div>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                p: 1,
                                m: 1,
                                bgcolor: "background.paper",
                              }}
                            >
                              <ColorButton variant="contained" size="small" onClick={(e) => deleteUserAddress(e, address._id)}>
                                <DeleteIcon />
                              </ColorButton>
                            </Box>
                          </li>
                        ))}
                        {/* <hr className="mt-2 mb-3" /> */}
                      </ol>
                    ) : (
                      <span className="lead">Add contact info to place order</span>
                    )}
                    <div className="d-flex pt-1 mb-2">
                      <button type="button" className="btn btn-outline-success flex-grow-1 text-uppercase quantityBtn" onClick={() => toggleUserAddress()}>
                        Add Contact
                      </button>
                    </div>
                    {toggleAddress ? <AddAddress /> : ""}
                    {/* End add contact info */}
                    {/* Add payment method */}
                    <h5 className="mt-4">Payment Methods</h5>
                    {payments && payments.length > 0 ? (
                      <ol className="list-group list-group-flush card-text">
                        {payments.map((payment) => {
                          let cardNumber = payment.visa.toString().slice(-5);
                          return (
                            <li className="list-group-item" key={payment._id}>
                              <div>
                                Visa <span>**** **** ****{cardNumber}</span>
                                <br />
                                Expires In:{" "}
                                <span>
                                  <Moment format="MM/YY">{payment.expires}</Moment>
                                </span>
                                <br />
                                Card Holder: <span>{payment.cardHolderName}</span>
                              </div>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  p: 1,
                                  m: 1,
                                  bgcolor: "background.paper",
                                }}
                              >
                                <ColorButton variant="contained" size="small" onClick={(e) => deleteUserPayment(e, payment._id)}>
                                  <DeleteIcon />
                                </ColorButton>
                              </Box>
                            </li>
                          );
                        })}
                        {/* <hr className="mt-2 mb-3" /> */}
                      </ol>
                    ) : (
                      <span className="lead">Add payment info to place order</span>
                    )}
                    <div className="d-flex pt-1 mb-2">
                      <button type="button" className="btn btn-outline-success flex-grow-1 text-uppercase quantityBtn" onClick={() => toggleUserPayment()}>
                        Add Payment
                      </button>
                    </div>
                    {togglePayment ? <AddPayment /> : ""}
                  </div>
                </div>
                {/* End add payment method */}
                {/* Recent Orders */}
                <div className="col-md-6">
                  <div className="card card-body">
                    <h5>Recent Orders</h5>
                    <p>
                      View Current{" "}
                      <Link to="/cart/orders" className="text-decoration-none">
                        Order
                      </Link>{" "}
                      Status
                    </p>
                    {showOrders.length > 0 && products.length > 0 ? (
                      showOrders.map((order) => (
                        <div key={order._id}>
                          <div>
                            Order ID{" "}
                            <span
                              className="text-success fw-bold
                            "
                            >
                              #{order._id.slice(-12)}
                            </span>
                            &nbsp;
                            <span>
                              @
                              <Moment
                                format="DD-MM-YY hh:mm a"
                                className="text-success fw-bold
                            "
                              >
                                {order.orderPlacedOn}
                              </Moment>
                            </span>
                          </div>
                          <table className="table">
                            <thead>
                              <tr className="cart-content bg-gradient">
                                <th scope="col">Name</th>
                                <th scope="col">Quantity</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.products.map((prod, index) => {
                                return (
                                  <tr className="cart-content bg-gradient" key={index}>
                                    <td className="col-md-8">
                                      {prod.product ? products.filter((product) => product._id === prod.product)[0].itemName : "Not found"}
                                    </td>
                                    <td className="align-middle">{prod.selectedQuantity}</td>
                                  </tr>
                                );
                              })}
                              <tr className="bg-secondary bg-gradient text-white">
                                <td className="col-md-8">Total Order Cost</td>
                                <td className="align-middle">{order.totalCost}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ))
                    ) : (
                      <p className="lead">No orders to show, please add an order</p>
                    )}
                    {/* <hr className="mt-2 mb-3" /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
  updateAvatar: PropTypes.func.isRequired,
  getProducts: PropTypes.func.isRequired,
  getProfile: PropTypes.func.isRequired,
  toggleUserAddress: PropTypes.func.isRequired,
  toggleUserPayment: PropTypes.func.isRequired,
  deleteAddress: PropTypes.func.isRequired,
  deletePayment: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  cart: state.cart,
  products: state.product.products,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  updateAvatar,
  toggleUserAddress,
  toggleUserPayment,
  getProducts,
  getProfile,
  deleteAddress,
  deletePayment,
  setAlert,
})(Profile);
