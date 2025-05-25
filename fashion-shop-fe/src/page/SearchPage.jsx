import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../component/layout/Header";
import Footer from "../component/layout/Footer";
import ProductList from "../component/product/ProductList";
import Paginated from "../component/ui/Pagination";
import Breadcrump from "../component/ui/Breadcrump";
import Filter from "../component/ui/Filter";
import axios from "axios";

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productsPerPage] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);

  const searchTerm = useState(location.state?.normalSearchTerm);
  useEffect(() => {
    if (!searchTerm) return;
    const params = {
      page: currentPage,
      size: productsPerPage,
      ...(selectedCategory && { idCat: selectedCategory }),
      ...(selectedSubCategory && { idSubcat: selectedSubCategory }),
      ...(selectedPriceRange && { priceRange: selectedPriceRange }),
      ...(selectedOccasion && { occasion: selectedOccasion }),
      ...(searchTerm.length > 0 && { nameProduct: searchTerm }),

  };

    axios.get(`http://localhost:8080/api/products/search`, { params })
      .then((res) => {
        setProducts(res.data.content);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements || 0);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, [currentPage, selectedCategory, selectedSubCategory, selectedPriceRange, selectedOccasion]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
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
      <Breadcrump text={"Sản phẩm"} />
      <div style={{ backgroundColor: "#FAEFEC" }}>
        <div className="d-flex align-items-center justify-content-between" style={{ margin: "10px 50px" }}>
          <h2 style={{ marginTop: "10px" }}>
            Sản phẩm:{" "}
            <span style={{ marginLeft: "20px", fontSize: "24px", fontStyle: "italic", fontWeight: "lighter" }}>
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

        <div style={{ display: "flex", marginLeft: "40px", justifyContent: "start", marginBottom: "20px", textAlign: "center" }}>
          {categories.map((category, index) => (
            <div key={category.id} className="d-flex align-items-center ms-2 me-2">
              <a
                href={`/products/category/${category.id}`}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                style={{
                  textDecoration: "none",
                  color: "black",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  textDecorationLine: hoverIndex === index ? "underline" : "none",
                }}
              >
                {category.name}
                <div className="vr" style={{ height: "auto", fontWeight: "normal" }}></div>
              </a>
            </div>
          ))}
        </div>

        <ProductList
          products={products}
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

export default SearchPage;