import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../component/layout/Header"
import Breadcrump from "../component/ui/Breadcrump"
import Footer from "../component/layout/Footer";
import ProductInfo from "../component/product/ProductInfo";


const ProductDetail=()=>{
    const { id } = useParams(); // lấy id từ đường dẫn
    const [products, setProducts] = useState([]); // setProducts để lấy sp trong db.json
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState({});

    //products in db.json
    useEffect(() => {
        fetch("/db.json")
            .then((response) => response.json())
            .then((data) => {
                setProducts(data.products);
            })
            .catch((error) => console.error("Error loading data:", error));
    }, []);

    //lấy sản phẩm theo id từ db.json để gán vào setProduct.
    useEffect(() => {
        fetch("/db.json")
            .then((response) => response.json())
            .then((data) => {
                const foundProduct = data.products.find((p) => p.id.toString() === id);
                if (foundProduct) {
                    setProduct(foundProduct);
                }
            })
            .catch((error) => console.error("Error loading data:", error));
    }, [id]);

    //categoríe in db.json
    useEffect(() => {
        fetch("/db.json")
            .then((response) => response.json())
            .then((data) => {
                setCategories(data.categories);
            })
            .catch((error) => console.error("Error loading data:", error));
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
            ></ProductInfo>
            <Footer></Footer>
        </div>
    )
}

export default ProductDetail