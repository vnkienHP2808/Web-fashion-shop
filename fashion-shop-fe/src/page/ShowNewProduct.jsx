import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../component/layout/Header";
import Footer from "../component/layout/Footer";
import ProductList from "../component/product/ProductList";
import Paginated from "../component/ui/Pagination";
import Breadcrump from "../component/ui/Breadcrump";
import Filter from "../component/ui/Filter";
import axios from "axios";

const ShowNewProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const productsPerPage = 20;

  useEffect(() => {
    const params = {
      page: currentPage,
      size: productsPerPage,
      ...(selectedCategory && { idCat: selectedCategory }),
      ...(selectedSubCategory && { idSubcat: selectedSubCategory }),
      ...(selectedPriceRange && { priceRange: selectedPriceRange }),
      ...(selectedOccasion && { occasion: selectedOccasion }),
    };

    axios
      .get("http://localhost:8080/api/products/new", { params })
      .then((res) => {
        setProducts(Array.isArray(res.data.content) ? res.data.content : []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      })
      .catch((err) => {
        console.error("Error fetching new products:", err);
        setProducts([]);
        setTotalPages(1);
        setTotalElements(0);
      });
  }, [currentPage, selectedCategory, selectedSubCategory, selectedPriceRange, selectedOccasion]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories")
      .then((res) => {
        setCategories(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setCategories([]);
      });
  }, []);

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    const numberValue = Number(value);

    if (checked) {
      setSelectedCategory(numberValue);
    } else {
      setSelectedCategory(null);
    }
    setSelectedSubCategory(null);
    setCurrentPage(1);
  };

  const handleSubCategoryChange = (event) => {
    const { value, checked } = event.target;
    const numberValue = Number(value);

    if (checked) {
      setSelectedSubCategory(numberValue);
    } else {
      setSelectedSubCategory(null);
    }
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedPriceRange(value);
    } else {
      setSelectedPriceRange(null);
    }
    setCurrentPage(1);
  };

  const handleOccasionChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedOccasion(value);
    } else {
      setSelectedOccasion(null);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Header />
      <Breadcrump text={"Sản phẩm mới"} />
      <div style={{ backgroundColor: "#FAEFEC" }}>
        <div
          className="d-flex align-items-center justify-content-between"
          style={{ margin: "10px 50px" }}
        >
          <h2 style={{ marginTop: "10px" }}>
            Sản phẩm mới:{" "}
            <span
              style={{
                marginLeft: "20px",
                fontSize: "24px",
                fontStyle: "italic",
                fontWeight: "lighter",
              }}
            >
              {totalElements} sản phẩm
            </span>
          </h2>
          <div style={{ marginLeft: "auto" }}>
            <Filter
              categories={categories}
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
              handleCategoryChange={handleCategoryChange}
              handleSubCategoryChange={handleSubCategoryChange}
              selectedPriceRange={selectedPriceRange}
              handlePriceRangeChange={handlePriceRangeChange}
              selectedOccasion={selectedOccasion}
              handleOccasionChange={handleOccasionChange}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
            />
          </div>
        </div>
        {Array.isArray(products) && products.length > 0 ? (
          <ProductList
            products={products}
            filterFn={() => true}
            title="Sản phẩm"
            isShowAll={true}
          />
        ) : (
          <div
            className="text-center"
            style={{
              margin: "0 auto",
              fontSize: "20px",
              fontStyle: "italic",
              fontWeight: "lighter",
              height: "50vh",
            }}
          >
            Chưa có sản phẩm mới nào.
          </div>
        )}
        <div className="d-flex justify-content-center" style={{ marginTop: "20px" }}>
          <Paginated
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShowNewProduct;