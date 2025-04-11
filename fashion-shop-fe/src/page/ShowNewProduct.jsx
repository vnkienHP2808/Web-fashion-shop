import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../component/layout/Header";
import Footer from "../component/layout/Footer";
import ProductList from "../component/product/ProductList";
import Paginated from "../component/ui/Pagination";
import Breadcrump from "../component/ui/Breadcrump";
import Filter from "../component/ui/Filter";
import axios from "axios";

const AllNewProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  const [selectedOccasion, setSelectedOccasion] = useState([]);

  const [openFilter, setOpenFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    const numberValue = Number(value);

    if (checked) {
      setSelectedCategory([numberValue]);
    } else {
      setSelectedCategory([]);
    }

    setSelectedSubCategory([]);
    setCurrentPage(1);
  };

  const handleSubCategoryChange = (event) => {
    const { value, checked } = event.target;
    const numberValue = Number(value);
    setSelectedSubCategory((prev) =>
      checked ? [...prev, numberValue] : prev.filter((item) => item !== numberValue)
    );
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (event) => {
    const { value, checked } = event.target;
    setSelectedPriceRange((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
    setCurrentPage(1);
  };

  const handleOccasionChange = (event) => {
    const { value, checked } = event.target;
    setSelectedOccasion((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
    setCurrentPage(1);
  };

  const filterFn = (product) => {
    const categoryMatch =
      selectedCategory.length === 0 || selectedCategory.includes(product.idCat);

    const subCategoryMatch =
      selectedSubCategory.length === 0 || selectedSubCategory.includes(product.idSubcat);

    const priceMatch =
      selectedPriceRange.length === 0 ||
      selectedPriceRange.some((range) => {
        const [min, max] = range.split("-").map(Number);
        return product.price >= min && product.price <= max;
      });

    const occasionMatch =
      selectedOccasion.length === 0 || selectedOccasion.includes(product.occasion);

    const newMatch = product.is_new === 1 || product.is_new === true;

    return categoryMatch && subCategoryMatch && priceMatch && occasionMatch && newMatch;
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const filteredProducts = products.filter(filterFn);
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Header />
      <Breadcrump text={"Sản phẩm mới"} />
      <div style={{ backgroundColor: "#FAEFEC" }}>
        <div className="d-flex align-items-center justify-content-between" style={{ margin: "10px 50px" }}>
          <h2 style={{ marginTop: "10px" }}>
            Sản phẩm mới:{" "}
            <span style={{ marginLeft: "20px", fontSize: "24px", fontStyle: "italic", fontWeight: "lighter" }}>
              {filteredProducts.length} sản phẩm
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

        <ProductList
          products={currentProducts}
          filterFn={() => true}
          title="Sản phẩm"
          isShowAll={true}
        />

        <div className="d-flex justify-content-center" style={{ marginTop: "20px" }}>
          <Paginated totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllNewProduct;
