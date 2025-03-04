import { useState } from "react"
import "../../style/productFormat.css"

/* giờ muốn dùng hover để set thì dùng thêm 1 biến hoverIndex
được set giá trị khi di chuột vào ảnh bằng hàm onMouseEnter và onmouseleave */

const ProductCard=({product_new_sale, index, type})=>{
    /* type để phân biệt trường hợp sale hay 0 */
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
                transform: hoverIndex === index ? "scale(1.05)" : "scale(1)",
            }}
        >

            {/* hiệu ứng opacity mờ dần để đổi ảnh nên tách ra thành 2 cái img khác nhau */}   
            {/* khi không hover thì ảnh 1 có độ sáng là 1, còn ảnh 2 ngược lại để có hiệu ứng mong muốn */}
            <div className="product-card-top">
                <a href="..." className="product-card-thumb">
                    <img
                        className="product-card-img"
                        //src={hoverIndex === index ? product_new_sale.images[1] : product_new_sale.images[0]}
                        src = {product_new_sale.images[0]}
                        alt={product_new_sale.name}
                        style={{
                            transition: "opacity 0.5s ease-in-out",
                            opacity: hoverIndex === index ? 0 : 1,
                            position: "absolute",
                        }}
                    />

                    <img
                        className="product-card-img"
                        //src={hoverIndex === index ? product_new_sale.images[1] : product_new_sale.images[0]}
                        src = {product_new_sale.images[1]}
                        alt={product_new_sale.name}
                        style={{
                            transition: "opacity 0.5s ease-in-out",
                            opacity: hoverIndex === index ? 1 : 0,
                        }}
                    />
                </a>
                    
                {/* thêm vào giỏ */}
                {/* sau này dùng để truy cập thay đổi giỏ hàng */}
                <a href="..." 
                    className="product-card-act"
                    style={{
                        transition: "opacity 0.5s ease-in-out",
                        opacity: hoverIndex === index ? 1 : 0,
                    }}
                >
                    <div >
                        <i class="bx bx-cart-alt text-center text-white fs-6 py-3 justify-content-center align-items-center"></i> Thêm vào giỏ
                    </div>
                </a>
            </div>

            <div className="product-card-info">
                <a href="" className="product-name">
                    Tên sản phẩm: {product_new_sale.name}
                </a>
                <a href="" className="product-cat">
                    Loại sản phẩm: {product_new_sale.category}
                </a>
                <a href="" className="product-brand">
                    Thương hiệu: {product_new_sale.brand}
                </a>
                <div className="product-price">
                    <p> 
                        Giá: 
                        {type === "New" 
                        ? <span> {product_new_sale.price}đ </span>
                        : <span> {product_new_sale.salePrice}đ &nbsp;
                                <span style={{
                                    color: "black",
                                    fontSize: "16px",
                                    opacity: "0.5",
                                    textDecorationLine: "line-through"
                                }}> {product_new_sale.price}đ </span>
                        </span>
                        }
                    </p>
                </div>
            </div>
        </div>

    )
}

export default ProductCard