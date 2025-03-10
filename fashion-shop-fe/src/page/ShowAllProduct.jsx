import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../component/layout/Header";
import Footer from "../component/layout/Footer";
import ProductList from "../component/product/ProductList";
import Paginated from "../component/ui/Pagination";
import Breadcrump from "../component/ui/Breadcrump";

const AllProduct = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategory] = useState([]);
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

    // tính toán các chỉ mục cho phân trang
    const indexOfLastProduct = Math.min(currentPage * productsPerPage, products.length);
    const indexOfFirstProduct = (currentPage - 1) * productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

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
