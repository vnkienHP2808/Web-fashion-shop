import React, { useState } from "react";
import "../../style/productCategory.css"
// const productCategories = [
//   { id: 1, name: "Đầm", image: "../../assets/user/image/category_dam.png", url: "url5/html" },
//   { id: 2, name: "Áo", image: "../../assets/user/image/category_ao.png", url: "url6/html" },
//   { id: 3, name: "Quần", image: "../../assets/user/image/category_quan.png", url: "url7/html" },
//   { id: 4, name: "Chân váy", image: "../../assets/user/image/category_chanvay.png", url: "url8/html" },
// ];

// dùng dữ liệu từ db.json

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
                  <img src={category.image_link} alt={category.name} />
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