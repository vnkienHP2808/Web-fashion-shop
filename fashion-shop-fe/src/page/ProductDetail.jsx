import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../component/layout/Header"
import Breadcrump from "../component/ui/Breadcrump"
import Footer from "../component/layout/Footer";
import ProductInfo from "../component/product/ProductInfo";
import axios from "axios";


const ProductDetail=()=>{
    const { id } = useParams(); // lấy id từ đường dẫn
    const [products, setProducts] = useState([]); // setProducts để lấy sp trong db.json
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState({});

    //products in db.json
    useEffect(() => {
        axios.get("http://localhost:9999/products").then((res) => {
          setProducts(res.data);
        });
    }, []);

    //lấy sản phẩm theo id từ db.json để gán vào setProduct.
    useEffect(() => {
        axios
          .get("http://localhost:9999/products/" + id)
          .then((res) => setProduct(res.data))
          .catch((err) => console.log("err"));
    }, []);

    //categoríe in db.json
    useEffect(() => {
        axios.get("http://localhost:9999/categories").then((res) => {
          setCategories(res.data);
        });
    }, []);

    //tìm id tên loại sản phẩm cho breadcrump 
    const getCategoryName = (categoryId) => {
        const category = categories.find(
          (cat) => cat.id.toString() === categoryId.toString()
        );
        return category ? category.name : "";
      };
    return(
        <div>
            <Header></Header>
            <Breadcrump 
                text={product.name}
                prevtext={getCategoryName(product.categoryId)}
                prevlink={`/products/category/${product.categoryId}`}
            >
            </Breadcrump>
            <ProductInfo
                product={product}
                listproduct={products}
            ></ProductInfo>
            <Footer></Footer>
        </div>
    )
}

export default ProductDetail