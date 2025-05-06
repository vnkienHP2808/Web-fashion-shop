import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Header from "../component/layout/Header";
import Footer from "../component/layout/Footer";
import ProductList from "../component/product/ProductList";
import Paginated from "../component/ui/Pagination";
import Breadcrump from "../component/ui/Breadcrump";
import Filter from "../component/ui/Filter";

const CategoryProduct = () => {
  const { categoryId, subcategoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  const [selectedOccasion, setSelectedOccasion] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productsPerPage] = useState(20);
  const [openFilter, setOpenFilter] = useState(false);
  const [currentCategorySubcategories, setCurrentCategorySubcategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  // Lấy sản phẩm theo category hoặc subcategory với phân trang và bộ lọc
  useEffect(() => {
    const params = {
      page: currentPage,
      size: productsPerPage,
      ...(selectedPriceRange.length > 0 && { priceRange: selectedPriceRange[0] }),
      ...(selectedOccasion.length > 0 && { occasion: selectedOccasion[0] }),
    };

    const url = subcategoryId
      ? `http://localhost:8080/api/products/category/${categoryId}/subcategory/${subcategoryId}`
      : `http://localhost:8080/api/products/category/${categoryId}`;

    axios
      .get(url, { params })
      .then((res) => {
        setProducts(res.data.content);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
        setTotalPages(1);
      });
  }, [categoryId, subcategoryId, currentPage, selectedPriceRange, selectedOccasion]);

  // Lấy danh sách categories
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories")
      .then((res) => {
        setCategories(res.data);
        const currentCategory = res.data.find(
          (cat) => cat.id?.toString() === categoryId
        );
        if (currentCategory) {
          setCurrentCategorySubcategories(currentCategory.subCategories || []);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, [categoryId]);

  // Xử lý bộ lọc
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Lấy tên category cho breadcrumb
  const getCategoryName = () => {
    const category = categories.find(
      (cat) => cat.id?.toString() === categoryId
    );
    return category ? category.name : "";
  };

  return (
    <div>
      <Header />
      <Breadcrump
        text={getCategoryName()}
        prevtext="Sản phẩm"
        prevlink="/products/all"
      />
      <div style={{ backgroundColor: "#FAEFEC" }}>
        <div
          className="d-flex align-items-center justify-content-between"
          style={{ margin: "10px 50px" }}
        >
          <h2 style={{ marginTop: "10px" }}>
            {subcategoryId
              ? currentCategorySubcategories.find(
                  (sub) => sub.id_subcat?.toString() === subcategoryId
                )?.name
              : getCategoryName()}
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

        <div
          style={{
            display: "flex",
            marginLeft: "40px",
            justifyContent: "start",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {currentCategorySubcategories.map((sub, index) => (
            <div
              key={sub.id_subcat}
              className="d-flex align-items-center ms-2 me-2"
            >
              <a
                href={`/products/category/${categoryId}/subcategory/${sub.id_subcat}`}
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
                {sub.name}
                <div
                  className="vr"
                  style={{ height: "auto", fontWeight: "normal" }}
                />
              </a>
            </div>
          ))}

          <div className="d-flex align-items-center ms-2 me-2">
            <a
              href={`/products/category/${categoryId}`}
              style={{
                textDecoration: "none",
                color: "black",
                fontWeight: "bold",
              }}
            >
              Tất cả {getCategoryName()}
            </a>
          </div>
        </div>

        {products.length === 0 ? (
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
            Chưa có sản phẩm nào trong danh mục này.
          </div>
        ) : (
          <ProductList
            products={products}
            filterFn={() => true}
            title="Sản phẩm"
            isShowAll={true}
          />
        )}

        <div
          className="d-flex justify-content-center"
          style={{ marginTop: "20px" }}
        >
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

export default CategoryProduct;