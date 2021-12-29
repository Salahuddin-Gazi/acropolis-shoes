import React, { Fragment, useEffect } from "react";
import { useParams } from "react-router";
import { connect } from "react-redux";
import { getProduct } from "../redux/actions/product";
import Spinner from "../Spinner/Spinner";
import PropTypes from "prop-types";
import ProductLoader from "./layout/ProductLoader";

const Product = ({ auth, product: { product, loading }, cart, getProduct }) => {
  const { prd_id } = useParams();
  useEffect(() => {
    getProduct(prd_id);
  }, [getProduct, prd_id]);

  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

  return loading || product === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <ProductLoader product={product} cart={cart} auth={auth} />
    </Fragment>
  );
};

Product.propTypes = {
  auth: PropTypes.object.isRequired,
  // cart: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
  getProduct: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  product: state.product,
  cart: state.cart.cart,
});

export default connect(mapStateToProps, { getProduct })(Product);
