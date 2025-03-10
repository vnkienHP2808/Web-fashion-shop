import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../component/layout/Header";
import Footer from "../component/layout/Footer";
import ProductList from "../component/product/ProductList";
import Paginated from "../component/ui/Pagination";
import Breadcrump from "../component/ui/Breadcrump";
import Filter from "../component/ui/Filter";

const AllProduct = () => {
    // 2 biến để duyệt sản phẩm và loại
    const [products, setProducts] = useState([]);
    const [categories, setCategory] = useState([]);
    // 3 biến để làm filter 
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState([]);
    const [selectedOccasion, setSelectedOccasion] = useState([]);
    // set mặc định chưa mở bảng filter
    const [openFilter, setOpenFilter] = useState(false);
    // để chuyển page sản phẩm
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(20);
    const [hoverIndex, setHoverIndex] = useState(null)

    //products in db.json
    useEffect(() => {
        fetch("/db.json")
            .then((response) => response.json())
            .then((data) => {
                setProducts(data.products);
            })
            .catch((error) => console.error("Error loading data:", error));
    }, []);

    //category in db.json
    useEffect(() => {
        fetch("/db.json")
            .then((response) => response.json())
            .then((data) => {
                setCategory(data.categories);
            })
            .catch((error) => console.error("Error loading data:", error));
    }, []);

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
        // tương tự
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
    const indexOfLastProduct = Math.min(currentPage * productsPerPage, products.length);
    const indexOfFirstProduct = (currentPage - 1) * productsPerPage;

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

    return (
        <div>
            <Header></Header>
            <Breadcrump text={"Sản Phẩm"}></Breadcrump>
            <div style={{backgroundColor: "#FAEFEC"}}>
                <div
                    className="d-flex align-items-center justify-content-between"
                    style={{
                        margin: "10px 50px",
                    }}
                >
                    <h2 style={{marginTop:"10px"}}>
                        Sản phẩm:{" "}
                        <span
                            style={{
                                marginLeft: "20px",
                                fontSize: "24px",
                                fontStyle: "italic",
                                fontWeight: "lighter",
                            }}
                        >
                            {products.length} sản phẩm
                        </span>
                    </h2>

                    <div style={{ marginLeft: "auto" }}>
                        <Filter
                            categories={categories}
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
                    {categories.map((category, index) => (
                        <div
                            key={category.id}
                            className="d-flex align-items-center ms-2 me-2"
                        >
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
                </div>

                <ProductList
                    products={currentProducts}
                    title="Tất cả Sản phẩm"
                    isShowAll={true}
                />

                <div className="d-flex justify-content-center" style={{ marginTop: "20px" }}>
                    <Paginated totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
                </div>
            </div>

            <Footer></Footer>
        </div>
    );
};

export default AllProduct;
