import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getProducts } from "../redux/actions/product.js";
import ItemLoader from "./ItemLoader.js";
import PropTypes from "prop-types";
import Spinner from "../Spinner/Spinner.js";

const Landing = ({ product: { products, loading }, getProducts }) => {
  useEffect(() => {
    getProducts();
  }, [getProducts]);

  // Sort <--->
  const [sort, setSort] = useState({
    sortByCategory: "",
    sortBy: "Descending",
  });
  let { sortByCategory, sortBy } = sort;

  const onChange = (e) => {
    e.preventDefault();
    setSort({
      ...sort,
      [e.target.name]: e.target.value,
    });
  };

  // Sort by time - descending
  let sortProducts = products && products.length > 0 ? products.sort((a, b) => new Date(b.itemPostedOn) - new Date(a.itemPostedOn)) : [];
  // Sort by time ascending
  if (sortBy === "Ascending") sortProducts = products.sort((a, b) => new Date(a.itemPostedOn) - new Date(b.itemPostedOn));
  // Sort by price low to high
  if (sortBy === "priceLowToHigh") sortProducts = products.sort((a, b) => a.itemPrice - b.itemPrice);
  // Sort by price high to low
  if (sortBy === "priceHighToLow") sortProducts = products.sort((a, b) => b.itemPrice - a.itemPrice);
  // End Sort <---/>

  // Filter By Category
  let productCategory = [];
  sortProducts.length > 0 &&
    sortProducts.forEach((prod) => {
      if (productCategory.indexOf(prod.itemCategory) < 0) productCategory.push(prod.itemCategory);
    });
  productCategory.sort();
  if (sortProducts.length > 0 && sortByCategory) {
    sortProducts = sortProducts.filter((prod) => prod.itemCategory === sortByCategory);
  }
  // Filter Sort By Category

  // Search
  const [searchString, setSearchString] = useState("");
  if (searchString && sortProducts.length > 0) {
    sortProducts = sortProducts.filter((character) => {
      return (
        character.itemName.toLowerCase().includes(searchString.toLowerCase()) ||
        character.itemCategory.toLowerCase().includes(searchString.toLowerCase()) ||
        character.itemBrand.toLowerCase().includes(searchString.toLowerCase())
      );
    });
  }
  // End Search
  return (
    <div className="container overflow-hidden mb-5">
      <header className="fs-1 fw-bold text-white my-2 mb-4">Acropolis Shoes</header>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div className="container">
            <div className="row mb-5">
              <div className="col col-lg-4 col-md-6 col-12 my-2">
                <div className="d-flex flex-row">
                  <span style={{ width: "40%", color: "#fff", marginRight: "2px", borderLeft: "2px solid #fff" }} className="justify-content-start px-2">
                    Filter By:
                  </span>
                  <select className="form-select form-select-sm" name="sortByCategory" onChange={(e) => onChange(e)}>
                    <option value="">All Categories</option>
                    {productCategory.length > 0 &&
                      productCategory.map((selectedCategory, index) => (
                        <option value={selectedCategory} key={index}>
                          {selectedCategory}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="col col-lg-4 col-md-6 col-12 my-2">
                <div className="d-flex flex-row">
                  <span style={{ width: "40%", color: "#fff", marginRight: "2px", borderLeft: "2px solid #fff" }} className="justify-content-start px-2">
                    Sort By:
                  </span>
                  <select className="form-select form-select-sm justify-content-end" defaultValue={"Descending"} name="sortBy" onChange={(e) => onChange(e)}>
                    <option value="Ascending">Time: Oldest First</option>
                    <option value="Descending">Time: Newest First</option>
                    <option value="priceLowToHigh">Price: Low To High</option>
                    <option value="priceHighToLow">Price: High To Low</option>
                  </select>
                </div>
              </div>
              <div className="col col-lg-4 col-md-6 col-12 my-2 d-flex input-group-sm">
                <span style={{ width: "40%", color: "#fff", marginRight: "2px", borderLeft: "2px solid #fff" }} className="justify-content-start px-2">
                  Search:
                </span>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchString}
                  onChange={(e) => {
                    e.preventDefault();
                    setSearchString(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row">
            {sortProducts.length > 0 ? (
              sortProducts.map((product) => <ItemLoader key={product._id} product={product} />)
            ) : (
              <div className="col-12 bg-white text-center text-danger fw-bold p-5 fs-2">Product Not Found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

Landing.propTypes = {
  product: PropTypes.object.isRequired,
  getProducts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  product: state.product,
});

export default connect(mapStateToProps, { getProducts })(Landing);
