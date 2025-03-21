import { useState, useContext} from "react"
import {useNavigate} from "react-router-dom"
import "../../style/productFormat.css"
import { CartContext } from "../../context/CartContext"
/* giờ muốn dùng hover để set thì dùng thêm 1 biến hoverIndex
được set giá trị khi di chuột vào ảnh bằng hàm onMouseEnter và onmouseleave */

const ProductCard = ({ products, index}) => {
    /* type để phân biệt trường hợp sale hay 0 */
    const [hoverIndex, setHoverIndex] = useState(null); // khai báo và set giá trị 
    const user = JSON.parse(sessionStorage.getItem("account"));
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const handleAddToCart = (e) => {
        e.stopPropagation(); // ngăn click lên ảnh
        e.preventDefault(); // ngăn điều hướng
        const loggedInUser = sessionStorage.getItem("account");
        if (!loggedInUser) {
          alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
          navigate("/sign-in");
          return;
        }
        addToCart(products);
        alert("Sản phẩm đã được thêm vào giỏ hàng.");
    };
    return (
        <div
            className="product-card-container"
            // set giá trị để so sánh
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            style={{
                transition: "transform 0.5s ease-in-out",
                //so sánh toán tử 3 ngôi set
                transform: hoverIndex === index ? "scale(1.05)" : "scale(1)",
            }}
        >
            {/* set logo new or sale */}
            {/* đã chỉnh lại chỉ còn 2 cái */}
            {/* thêm vừa new vừa sale */}
            {(products.isNew && products.isSale && products.salePrice != null) ? (
                <>
                    <div
                        style={{
                            position: "absolute",
                            top: "30px",
                            left: "30px",
                            backgroundColor: "orange",
                            borderRadius: "5px",
                            color: "white",
                            padding: "5px",
                            fontWeight: "bold",
                            zIndex: 5,
                        }}
                    >
                        <i className="bi bi-moon-stars-fill"></i>
                        New
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            top: "70px",
                            left: "30px",
                            backgroundColor: "red",
                            borderRadius: "5px",
                            color: "white",
                            padding: "5px",
                            fontWeight: "bold",
                            zIndex: 5,
                        }}
                    >
                        <i className="bi bi-lightning-charge-fill"></i>-
                        {Math.floor(
                            ((products.price - products.salePrice) / products.price) * 100
                        )}
                        %
                    </div>
                </>
            ) : products.isNew ? (
                <div
                    style={{
                        position: "absolute",
                        top: "30px",
                        left: "30px",
                        backgroundColor: "orange",
                        borderRadius: "5px",
                        color: "white",
                        padding: "5px",
                        fontWeight: "bold",
                        zIndex: 5,
                    }}
                >
                    <i className="bi bi-moon-stars-fill"></i>
                    New
                </div>
            ) : products.isSale && products.salePrice != null ? (
                <div
                    style={{
                        position: "absolute",
                        top: "30px",
                        left: "30px",
                        backgroundColor: "red",
                        borderRadius: "5px",
                        color: "white",
                        padding: "5px",
                        fontWeight: "bold",
                        zIndex: 5,
                    }}
                >
                    <i className="bi bi-lightning-charge-fill"></i>-
                    {Math.floor(
                        ((products.price - products.salePrice) / products.price) * 100
                    )}
                    %
                </div>
            ) : null}

            {/* hiệu ứng opacity mờ dần để đổi ảnh nên tách ra thành 2 cái img khác nhau */}
            {/* khi không hover thì ảnh 1 có độ sáng là 1, còn ảnh 2 ngược lại để có hiệu ứng mong muốn */}
            <div className="product-card-top">
                <div className="product-card-thumb">
                    <img
                        className="product-card-img"
                        //src={hoverIndex === index ? products.images[1] : products.images[0]}
                        src={products.images[0]}
                        alt={products.name}
                        style={{
                            transition: "opacity 0.5s ease-in-out",
                            opacity: hoverIndex === index ? 0 : 1,
                            position: "absolute",
                        }}
                    />

                    <img
                        className="product-card-img"
                        //src={hoverIndex === index ? products.images[1] : products.images[0]}
                        src={products.images[1]}
                        alt={products.name}
                        style={{
                            transition: "opacity 0.5s ease-in-out",
                            opacity: hoverIndex === index ? 1 : 0,
                        }}
                    />
                </div>

                {/* thêm vào giỏ */}
                {/* sau này dùng để truy cập thay đổi giỏ hàng */}
                {user !== null && user.role === "customer" && (
                    <button
                        className="product-card-act"
                        style={{
                            transition: "opacity 0.5s ease-in-out",
                            opacity: hoverIndex === index ? 1 : 0,
                        }}
                    >
                        <div onClick={handleAddToCart}>
                            <i class="bx bx-cart-alt text-center text-black fs-5 py-3 justify-content-center align-items-center"></i>
                            &nbsp; Thêm vào giỏ
                        </div>
                    </button>
                )}

                {user !== null && user.role === "admin" && (
                    <button
                        className="product-card-act"
                        style={{
                            transition: "opacity 0.5s ease-in-out",
                            opacity: hoverIndex === index ? 1 : 0,
                        }}
                    >
                        <a
                            href={`/updateproduct/${products.id}`}
                            style={{ textDecoration: "none" }}
                        >
                            Sửa sản phẩm
                        </a>
                    </button>
                )}
            </div>

            <div className="product-card-info">
                <a href="" className="product-name">
                    {products.name}
                </a>
                {/* <a href="" className="product-cat">
                    Loại sản phẩm: {products.category}
                </a>
                <a href="" className="product-brand">
                    Thương hiệu: {products.brand}
                </a> */}
                <div className="product-price">
                    <p>
                        Giá:
                        {!products.salePrice
                            ? <span style={{color: "black"}}> {products.price}đ </span>
                            : <span> {products.salePrice}đ &nbsp;
                                <span style={{
                                    color: "black",
                                    fontSize: "16px",
                                    opacity: "0.5",
                                    textDecorationLine: "line-through"
                                }}> {products.price}đ </span>
                            </span>
                        }
                    </p>
                </div>
            </div>
        </div>

    )
}

export default ProductCard