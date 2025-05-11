import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/productFormat.css";
import { CartContext } from "../../context/CartContext";

const ProductCard = ({ products, index }) => {
    const [hoverIndex, setHoverIndex] = useState(null);
    const user = JSON.parse(sessionStorage.getItem("account"));
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const imageBaseUrl = "http://localhost:8080/images/";

    const handleAddToCart = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const loggedInUser = sessionStorage.getItem("account");
        if (!loggedInUser) {
            alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
            navigate("/sign-in");
            return;
        }
        if (products.in_stock > 0) {
            addToCart({ ...products, quantity: 1 });
            alert("Sản phẩm đã được thêm vào giỏ hàng!");
        } else {
            alert("Sản phẩm hiện đã hết hàng.");
        }
    };

    return (
        <div
            className="product-card-container"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            style={{
                transition: "transform 0.5s ease-in-out",
                transform: hoverIndex === index ? "scale(1.05)" : "scale(1)",
            }}
        >
            {(products.is_new === true && products.is_sale === true && products.sale_price != null) ? (
                <>
                    <div style={{
                        position: "absolute",
                        top: "30px",
                        left: "30px",
                        backgroundColor: "orange",
                        borderRadius: "5px",
                        color: "white",
                        padding: "5px",
                        fontWeight: "bold",
                        zIndex: 5,
                    }}>
                        <i className="bi bi-moon-stars-fill"></i> New
                    </div>

                    <div style={{
                        position: "absolute",
                        top: "70px",
                        left: "30px",
                        backgroundColor: "red",
                        borderRadius: "5px",
                        color: "white",
                        padding: "5px",
                        fontWeight: "bold",
                        zIndex: 5,
                    }}>
                        <i className="bi bi-lightning-charge-fill"></i>-
                        {Math.floor(((products.price - products.sale_price) / products.price) * 100)}%
                    </div>
                </>
            ) : products.is_new === true ? (
                <div style={{
                    position: "absolute",
                    top: "30px",
                    left: "30px",
                    backgroundColor: "orange",
                    borderRadius: "5px",
                    color: "white",
                    padding: "5px",
                    fontWeight: "bold",
                    zIndex: 5,
                }}>
                    <i className="bi bi-moon-stars-fill"></i> New
                </div>
            ) : products.is_sale === true && products.sale_price != null ? (
                <div style={{
                    position: "absolute",
                    top: "30px",
                    left: "30px",
                    backgroundColor: "red",
                    borderRadius: "5px",
                    color: "white",
                    padding: "5px",
                    fontWeight: "bold",
                    zIndex: 5,
                }}>
                    <i className="bi bi-lightning-charge-fill"></i>-
                    {Math.floor(((products.price - products.sale_price) / products.price) * 100)}%
                </div>
            ) : null}

            <div className="product-card-top">
                <div className="product-card-thumb">
                    <img
                        className="product-card-img"
                        src={`${imageBaseUrl}${products.images[0].imageLink}`}
                        alt={products.name_product}
                        style={{
                            transition: "opacity 0.5s ease-in-out",
                            position: "absolute",
                        }}
                        onError={(e) => console.error("Image load error:", e.target.src)}
                    />
                    <img
                        className="product-card-img"
                        src={`${imageBaseUrl}${products.images[1]?.imageLink || products.images[0].imageLink}`}
                        alt={products.name_product}
                        style={{
                            transition: "opacity 0.5s ease-in-out",
                        }}
                        onError={(e) => console.error("Image load error:", e.target.src)}
                    />
                </div>

                {user !== null && user.role === "Customer" && (
                    <button
                        className="product-card-act"
                        style={{
                            transition: "opacity 0.5s ease-in-out",
                            opacity: hoverIndex === index ? 1 : 0,
                        }}
                    >
                        <div onClick={handleAddToCart}>
                            <i className="bx bx-cart-alt text-center text-black fs-5 py-3 justify-content-center align-items-center"></i>
                              Thêm vào giỏ
                        </div>
                    </button>
                )}

                {user !== null && user.role === "Admin" && (
                    <button
                        className="product-card-act"
                        style={{
                            transition: "opacity 0.5s ease-in-out",
                            opacity: hoverIndex === index ? 1 : 0,
                        }}
                    >
                        <a
                            href={`/updateproduct/${products.idProduct}`}
                            style={{ textDecoration: "none" }}
                        >
                            Sửa sản phẩm
                        </a>
                    </button>
                )}
            </div>

            <div className="product-card-info">
                <a href={`/products/${products.idProduct}`} className="product-name">
                    {products.name_product}
                </a>
                <div className="product-price">
                    <p>
                        Giá:  
                        {!products.sale_price ? (
                            <span style={{ color: "black" }}>{products.price}đ</span>
                        ) : (
                            <span>
                                {products.sale_price}đ  
                                <span style={{
                                    color: "black",
                                    fontSize: "16px",
                                    opacity: "0.5",
                                    textDecorationLine: "line-through"
                                }}>
                                    {products.price}đ
                                </span>
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;