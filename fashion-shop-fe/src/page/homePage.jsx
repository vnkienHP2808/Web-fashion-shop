import Header from "../component/layout/Header";
import React, { useState, useEffect } from "react";
import Slider from "../component/ui/Slider";
import ProductCategories from "../component/product/ProductCategory";
import NewArrival from "../component/product/NewArrival";
import SaleProduct from "../component/product/SaleProduct";
import Footer from "../component/layout/Footer";
import axios from "axios";

const HomePage = () => {
  const [newProducts, setNewProducts] = useState([]); // State cho sản phẩm mới
  const [saleProducts, setSaleProducts] = useState([]); // State cho sản phẩm giảm giá
  const [product_cat, setProductCategories] = useState([]);

  // Lấy sản phẩm mới
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products/new?page=1&size=8") // Lấy 8 sản phẩm mới
      .then((res) => {
        const fetchedProducts = Array.isArray(res.data.content) ? res.data.content : [];
        setNewProducts(fetchedProducts);
      })
      .catch((err) => {
        console.error("Error fetching new products:", err);
        setNewProducts([]);
      });
  }, []);

  // Lấy sản phẩm giảm giá
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products/sale?page=1&size=8") // Lấy 8 sản phẩm giảm giá
      .then((res) => {
        const fetchedProducts = Array.isArray(res.data.content) ? res.data.content : [];
        setSaleProducts(fetchedProducts);
      })
      .catch((err) => {
        console.error("Error fetching sale products:", err);
        setSaleProducts([]);
      });
  }, []);

  // Lấy danh mục (category)
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories")
      .then((res) => {
        setProductCategories(res.data);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <div className="page-container">
      <Header />
      <Slider />
      <ProductCategories product_cat={product_cat} />
      <NewArrival products={newProducts} title="Hàng mới về" />
      <SaleProduct products={saleProducts} title="Hàng giảm giá" />
      <Footer />
    </div>
  );
};

export default HomePage;