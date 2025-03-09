import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../component/layout/Header";
import Footer from "../component/layout/Footer";
import ProductList from "../component/product/ProductList";
import Paginated from "../component/ui/Pagination";

const AllProduct = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(20);

    useEffect(() => {
        fetch("/db.json")
            .then((response) => response.json())
            .then((data) => {
                setProducts(data.products);
            })
            .catch((error) => console.error("Error loading data:", error));
    }, []);

    // Tính toán các chỉ mục cho phân trang
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    // Xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <Header></Header>

            <ProductList 
                products={currentProducts} 
                title="Tất cả Sản phẩm" 
                isShowAll={true} 
            />

            <div className="d-flex justify-content-center" style={{ margin: "20px 0" }}>
                <Paginated totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
            </div>

            <Footer></Footer>
        </div>
    );
};

export default AllProduct;
