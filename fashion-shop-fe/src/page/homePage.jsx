import Header from "../component/layout/Header";
import React, { useState, useEffect } from "react";
import Slider from "../component/ui/Slider";
import ProductCategories from "../component/product/ProductCategory";
import NewArrival from "../component/product/NewArrival";
import SaleProduct from "../component/product/SaleProduct";
import Footer from "../component/layout/Footer";
const HomePage = () =>{
    const [products, setProduct] = useState([]);
    const [product_cat, setProductCategories] = useState([]);

    // product có cả new sale
    useEffect(() => {
        fetch("/db.json") 
            .then((response) => response.json())
            .then((data) => {
                setProduct(data.products);
            })
            .catch((error) => console.error("Error loading data:", error));
    }, []);

    //category
    useEffect(() => {
        fetch("/db.json") 
            .then((response) => response.json())
            .then((data) => {
                setProductCategories(data.categories);
            })
            .catch((error) => console.error("Error loading data:", error));
    }, []);

    return (
        <div className="page-container">
            <Header></Header>
            <Slider></Slider>
            <ProductCategories product_cat={product_cat}></ProductCategories>
            <NewArrival
                products={products} 
        /*products có thể sau này dùng cho mấy biến page khác có thể đổi*/
                title="Hàng mới về"
            ></NewArrival>
            <SaleProduct 
                products={products}
                title="Hàng giảm giá"
            ></SaleProduct>
            <Footer></Footer>
        </div>
    )
}
export default HomePage;