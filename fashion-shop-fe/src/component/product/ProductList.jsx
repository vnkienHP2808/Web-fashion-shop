import React, { useState } from "react";
import ProductCard from "./ProductCard";
import "../../style/productFormat.css";
import AllButton from "../ui/AllButton";

const ProductList = ({ products, filterFn, title, isShowAll, btnhref }) => {
    const [itemsToShow, setItemToShow] = useState(8);

    return (
        <div className="product-list-container">
            {!isShowAll ? (
                <>
                    <div className="product-list-grid">
                        {products
                            .filter(
                                (product) =>
                                    product.status === "Active" && filterFn(product)
                            )
                            .slice(0, itemsToShow)
                            .map((product, index) => (
                                <a
                                    key={product.idProduct}
                                    href={`/products/${product.idProduct}`}
                                    style={{ textDecoration: "none" }}
                                >
                                    <ProductCard
                                        products={product}
                                        index={index}
                                    />
                                </a>
                            ))}
                    </div>
                    <div>
                        <AllButton
                            text={`Xem tất cả ${title}`.toUpperCase()}
                            href={btnhref}
                        />
                    </div>
                </>
            ) : (
                <>
                    <div className="product-list-grid">
                        {products
                            .filter(
                                (product) =>
                                    product.status === "Active" && filterFn(product)
                            )
                            .map((product, index) => (
                                <a
                                    key={product.idProduct}
                                    href={`/products/${product.idProduct}`}
                                    style={{ textDecoration: "none" }}
                                >
                                    <ProductCard
                                        products={product}
                                        index={index}
                                        type={
                                            title === "Hàng mới về"
                                                ? "New"
                                                : title === "Hàng giảm giá"
                                                ? "Sale"
                                                : ""
                                        }
                                    />
                                </a>
                            ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductList;
