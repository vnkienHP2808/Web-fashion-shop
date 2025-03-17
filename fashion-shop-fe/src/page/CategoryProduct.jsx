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
    const {categoryId, subcategoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState([]);
    const [selectedOccasion, setSelectedOccasion] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(20);
    const [openFilter, setOpenFilter] = useState(false);
    const [currentCategorySubcategories, setCurrentCategorySubcategories] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(null);

    useEffect(() => {
        const url = subcategoryId
          ? `http://localhost:9999/products?categoryId=${categoryId}&subcategoryId=${subcategoryId}`
          : `http://localhost:9999/products?categoryId=${categoryId}`;
    
        axios.get(url).then((res) => {
          setProducts(res.data);
        });
    }, [categoryId, subcategoryId]);
    
    //category in db.json
    useEffect(() => {
        axios.get("http://localhost:9999/categories").then((res) => {
          setCategories(res.data);
    
          const currentCategory = res.data.find(
            (cat) => cat.id.toString() === categoryId
          );
          if (currentCategory) {
            setCurrentCategorySubcategories(currentCategory.subcategories);
          }
        });
    }, [categoryId]);


  // thay đổi khi 1 sự kiện nhấn vào mục chọn 
  const handleCategoryChange = (event) => {
    const { value, checked } = event.target; // xem chỉ mục vừa thay đổi
    setSelectedCategory((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    // checked == true (checkbox được chọn) => thêm value vào mảng và ngược lại
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

  // đây là khi trả về các sản phẩm thỏa mãn điều kiện
  const filterFn = (product) => {
    // ktra sản phẩm nằm trong danh mục được chọn 0
        // nếu 0 có danh mục nào được chọn (selectedCategory.length === 0) => chấp nhận tất cả sản phẩm.
        // Nếu có danh mục được chọn => ktra xem product.categoryId có nằm trong danh sách selectedCategory không.
    const categoryMatch =
      selectedCategory.length === 0 ||
      selectedCategory.includes(product.categoryId.toString());
    //tương tự
    const priceMatch =
      selectedPriceRange.length === 0 ||
      selectedPriceRange.some((range) => {
        const [min, max] = range.split("-").map(Number);
        return product.price >= min && product.price <= max;
      });
    // tương tự
    const occasionMatch =
      selectedOccasion.length === 0 ||
      selectedOccasion.includes(product.occasion);

    return categoryMatch && priceMatch && occasionMatch;
  };

  // tính toán các chỉ mục cho phân trang kết hợp với việc chọn filter, nếu mặc định = show all
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const filteredProducts = products.filter(filterFn);
  const currentProducts = filteredProducts.slice(
      indexOfFirstProduct,
      indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
  };

  // lấy tên cho phần breadcrump
  const getCategoryName = () => {
    const category = categories.find((cat) => cat.id.toString() === categoryId);
    return category ? category.name : "";
  };

  return (
    <div>
        <Header></Header>
        <Breadcrump
             text={getCategoryName()}
             prevtext="Sản phẩm"
             prevlink="/products/all">
        </Breadcrump>
        <div style={{backgroundColor: "#FAEFEC"}}>
            <div
                className="d-flex align-items-center justify-content-between"
                style={{
                    margin: "10px 50px",
                }}
            >
                <h2 style={{marginTop:"10px"}}>
                      {subcategoryId
                          ? currentCategorySubcategories.find(
                              (sub) => sub.id.toString() === subcategoryId
                          )?.name
                          : getCategoryName()}:{" "}
                    <span
                        style={{
                            marginLeft: "20px",
                            fontSize: "24px",
                            fontStyle: "italic",
                            fontWeight: "lighter",
                        }}
                    >
                        {filteredProducts.length} sản phẩm
                    </span>
                </h2>

                <div style={{ marginLeft: "auto" }}>
                    <Filter
                        categories={currentCategorySubcategories}
                        selectedCategory={selectedCategory}
                        handleCategoryChange={handleCategoryChange}
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
                }}>
                {currentCategorySubcategories.map((category, index) => (
                    <div
                        key={category.id}
                        className="d-flex align-items-center ms-2 me-2"
                    >
                        <a
                            href={`/products/category/${categoryId}/subcategory/${category.id}`}
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                            style={{
                                textDecoration: "none",
                                color: "black",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                textDecorationLine: hoverIndex === index ? "underline" : "none",
                            }}>
                            {category.name}
                            <div className="vr" style={{
                                height: "auto",
                                fontWeight: "normal"
                            }}>
                            </div>
                        </a>
                    </div>
                ))}

                {/* mục tất cả để quay trở về */}
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

            {filteredProducts.length === 0 ? (
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
                    products={currentProducts}
                    filterFn={(product) => true} // vì đây là show tất cả sản phẩm nên để true để không cần lọc gì show ra
                    title="Sản phẩm"
                    isShowAll={true}
                />
            )}

            <div className="d-flex justify-content-center" style={{ marginTop: "20px" }}>
                <Paginated totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
            </div>
        </div>

        <Footer></Footer>
    </div>
);
};

export default CategoryProduct;
