import Header from "../component/layout/Header";
import React, { useState, useEffect } from "react";
import Slider from "../component/ui/Slider";
import ProductCategories from "../component/product/ProductCategory";
import ProductList from "../component/product/ProductList";
import Footer from "../component/layout/Footer";
const HomePage = () =>{
    const [product_new, setProductNew] = useState([]);
    const [product_cat, setProductCategories] = useState([]);
    const [product_sale, setProductSale] = useState([]);

    // new
    useEffect(() => {
        fetch("/db.json") 
            .then((response) => response.json())
            .then((data) => {
                setProductNew(data.product_new);
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

    // sale
    useEffect(() => {
        fetch("/db.json") 
            .then((response) => response.json())
            .then((data) => {
                setProductSale(data.product_sale);
            })
            .catch((error) => console.error("Error loading data:", error));
    }, []);
    return (
        <div className="page-container">
            <Header></Header>
            <Slider></Slider>
            <ProductCategories product_cat={product_cat}></ProductCategories>
            <ProductList 
                product_new_sale={product_new} 
        /*product_new_sale có thể sau này dùng cho mấy biến page khác có thể đổi*/
                title="Hàng mới về"
            ></ProductList>
            <ProductList 
                product_new_sale={product_sale}
                title="Hàng giảm giá"
            ></ProductList>
            <Footer></Footer>
        </div>
    )
}
export default HomePage;