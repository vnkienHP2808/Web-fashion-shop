import { useState } from "react"
import "../../style/productFormat.css"

/* giờ muốn dùng hover để set thì dùng thêm 1 biến hoverIndex
được set giá trị khi di chuột vào ảnh bằng hàm onMouseEnter và onmouseleave */

const ProductCard=({product_demo, index})=>{
    const [hoverIndex, setHoverIndex] = useState(null); // khai báo và set giá trị 
    return(
        <div 
            className="product-card-container"
            // set giá trị để so sánh
            onMouseEnter={()=> setHoverIndex(index)}
            onMouseLeave={()=> setHoverIndex(null)}
            style={{
                transition: "transform 0.5s ease-in-out",
                //so sánh toán tử 3 ngôi set
                transform: hoverIndex === index ? "scale(1.05)" : "scale(1)"
            }}
        >
            {/* hiệu ứng opacity mờ dần để đổi ảnh nên tách ra thành 2 cái img khác nhau */}   
            <img
                className="product-card-img"
                //src={hoverIndex === index ? product_demo.images[1] : product_demo.images[0]}
                src = {product_demo.images[0]}
                alt={product_demo.name}
                style={{
                    transition: "opacity 0.5s ease-in-out",
                    opacity: hoverIndex === index ? 0 : 1,
                    position: "absolute",
                }}
            />

            <img
                className="product-card-img"
                //src={hoverIndex === index ? product_demo.images[1] : product_demo.images[0]}
                src = {product_demo.images[1]}
                alt={product_demo.name}
                style={{
                    transition: "opacity 0.5s ease-in-out",
                    opacity: hoverIndex === index ? 1 : 0,
                }}
            />

            <div className="product-card-info">
                <a href="" className="product-name">
                    Tên sản phẩm: {product_demo.name}
                </a>
                <a href="" className="product-cat">
                    Loại sản phẩm: {product_demo.category}
                </a>
                <a href="" className="product-brand">
                    Thương hiệu: {product_demo.brand}
                </a>
                <div className="product-price">
                    <p> Giá:&nbsp; </p>
                    {product_demo.price}
                </div>
            </div>
        </div>

    )
}

export default ProductCard