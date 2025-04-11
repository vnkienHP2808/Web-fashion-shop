import React, { useState } from "react";
import "../../style/productCategory.css"


const ProductCategories=({product_cat}) => {
  return (
    <div 
      className="PRODUCT-container"
    >
      <div className="headline">
          <h3>Danh mục sản phẩm</h3>
      </div>
      <ul className="products">
        {product_cat.slice(0, 4).map((category) => (
          <li key={category.id}>
            <div className="product-item">
              <div className="product-top">
                <a href={`/products/category/${category.id}`} className="product-thumb">
                  <img src={category.imageLink} alt={category.name} />
                </a>
                <a href={category.url} className="product-type"> {category.name} </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductCategories;