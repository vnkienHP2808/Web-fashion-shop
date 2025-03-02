import Header from "../component/layout/Header";
import React, { useState, useEffect } from "react";
// import Footer from "./component/layout/Footer";
import Slider from "../component/ui/Slider";
import ProductCategories from "../component/ui/ProductCategory";
import ProductList from "../component/product/ProductList";
const HomePage = () =>{
    const [product_demo, setProducts] = useState([])
    useEffect(() => {
        fetch("/db.json") 
            .then((response) => response.json())
            .then((data) => {
                setProducts(data.product_demo);
            })
            .catch((error) => console.error("Error loading data:", error));
    }, []);
    return (
        <div className="page-container">
            <Header></Header>
            <Slider></Slider>
            <ProductCategories></ProductCategories>
            <ProductList product_demo={product_demo}></ProductList>
        </div>
    )
}
export default HomePage;