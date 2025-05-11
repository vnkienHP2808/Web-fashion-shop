import { useState, useEffect, useContext } from "react";
import "../../style/productInfomation.css";
import { Button } from "react-bootstrap";
import RelateProduct from "./RelateProduct";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const ProductInfo = ({ product, listproduct }) => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("account"));
    const imageBaseUrl = "http://localhost:8080/images/"; // Đường dẫn cơ bản cho hình ảnh sản phẩm

    // Ảnh minh họa sản phẩm
    const [selectedImage, setSelectedImage] = useState(
        product.images && product.images.length > 0 ? `${imageBaseUrl}${product.images[0].imageLink}` : ""
    );
    // Quản lý kho hàng
    const [quantity, setQuantity] = useState(1);

    // Chọn size
    const sizes = ["S", "M", "L", "XL"];
    const [selectedSize, setSelectedSize] = useState("S");

    useEffect(() => {
        if (product.images && product.images.length > 0) {
            setSelectedImage(`${imageBaseUrl}${product.images[0].imageLink}`);
        } else {
            setSelectedImage(""); // Đặt rỗng nếu không có hình ảnh
        }
    }, [product.idProduct]);

    // Sử dụng để thêm vào giỏ hàng
    const { addToCart } = useContext(CartContext);
    const handleAddToCart = () => {
        if (product.in_stock > 0) {
            addToCart({ ...product, quantity });
            alert("Sản phẩm đã được thêm vào giỏ hàng!");
        } else {
            alert("Sản phẩm hiện đã hết hàng.");
        }
    };

    const handleQuantityChange = (type) => {
        if (type === "increase") {
            setQuantity((prev) => (prev < product.in_stock ? prev + 1 : prev));
        } else if (type === "decrease") {
            setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
        } else {
            const value = parseInt(type, 10);
            if (!isNaN(value)) {
                const validValue = Math.max(1, Math.min(value, product.in_stock));
                setQuantity(validValue);
            }
        }
    };

    const navigate = useNavigate();

    const handleBuyNow = () => {
        const selectedProduct = {
            product: { ...product },
            quantity: quantity,
        };
        navigate("/checkout", { state: { selectedCartItems: [selectedProduct] } });
    };

    return (
        <div>
            <div className="product-infomation">
                <div className="product-img">
                    <div className="selected-img">
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt="Main image product"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    border: "1px solid #ccc",
                                }}
                                onError={(e) => {
                                    console.error("Error loading main image:", e.target.src);
                                    e.target.src = "/path/to/placeholder-image.png";
                                }}
                            />
                        ) : (
                            <p>Không có hình ảnh</p>
                        )}
                    </div>

                    <div className="other-img">
                        {product.images && product.images.length > 0 ? (
                            product.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={`${imageBaseUrl}${image.imageLink}`}
                                    alt="Product img"
                                    onClick={() => setSelectedImage(`${imageBaseUrl}${image.imageLink}`)}
                                    className={`thumbnail ${
                                        selectedImage === `${imageBaseUrl}${image.imageLink}` ? "active" : ""
                                    }`}
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        objectFit: "cover",
                                        margin: "5px",
                                        border: "1px solid #ccc",
                                    }}
                                    onError={(e) => {
                                        console.error("Error loading thumbnail image:", e.target.src);
                                        e.target.src = "/path/to/placeholder-image.png";
                                    }}
                                />
                            ))
                        ) : (
                            <p>Không có hình ảnh thu nhỏ</p>
                        )}
                    </div>
                </div>

                <div className="product-detail">
                    <h2>{product.name_product}</h2>
                    <h5>
                        Mã sản phẩm: {product.idProduct} | Tình trạng:{" "}
                        {product.in_stock > 0 ? "Còn Hàng" : "Hết Hàng"}
                    </h5>

                    <small className="text-muted">
                        Số lượng đã bán: {product.sold_quantity}
                    </small>

                    <table className="product-info-table">
                        <tbody>
                            <tr>
                                <td>Giá:</td>
                                <td>
                                    {product.sale_price != null && product.is_sale ? (
                                        <>
                                            <span className="sale-price">{product.sale_price}₫</span>
                                            <span className="original-price">{product.price}₫</span>
                                            <span className="discount">
                                                <i className="bi bi-lightning-charge-fill"></i>-
                                                {Math.floor(
                                                    ((product.price - product.sale_price) / product.price) * 100
                                                )}
                                                %
                                            </span>
                                        </>
                                    ) : (
                                        <span className="price" style={{ fontSize: "24px", fontWeight: "bold" }}>
                                            {product.price}₫
                                        </span>
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <td>Kích thước:</td>
                                <td>
                                    <div className="product-size">
                                        {sizes.map((size) => (
                                            <span
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`size-option ${selectedSize === size ? "selected" : ""}`}
                                            >
                                                {size}
                                                {selectedSize === size && <i className="bi bi-check checkmark"></i>}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td>Số lượng:</td>
                                <td>
                                    <div className="quantityselector">
                                        <Button
                                            variant="light"
                                            onClick={() => handleQuantityChange("decrease")}
                                            disabled={quantity <= 1}
                                        >
                                            <i className="bi bi-dash-lg"></i>
                                        </Button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => handleQuantityChange(e.target.value)}
                                            className="quantity-input mx-2"
                                            style={{ width: "50px", textAlign: "center" }}
                                            min="1"
                                            max={product.in_stock}
                                        />
                                        <Button
                                            variant="light"
                                            onClick={() => handleQuantityChange("increase")}
                                            disabled={quantity >= product.in_stock}
                                        >
                                            <i className="bi bi-plus-lg"></i>
                                        </Button>
                                    </div>
                                    <small className="text-muted" style={{ marginLeft: "10px" }}>
                                        {product.in_stock} sản phẩm có sẵn
                                    </small>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {loggedInUser !== null && loggedInUser.role === "Admin" && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "10px",
                                marginTop: "20px",
                            }}
                        >
                            <Button
                                className="add-to-cart-btn"
                                onClick={() => navigate(`/updateproduct/${product.idProduct}`)}
                            >
                                Sửa sản phẩm
                            </Button>
                        </div>
                    )}
                    {loggedInUser !== null && loggedInUser.role === "Customer" && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "10px",
                                marginTop: "20px",
                            }}
                        >
                            {product.in_stock > 0 ? (
                                <>
                                    <Button className="add-to-cart-btn" onClick={handleAddToCart}>
                                        Thêm vào giỏ
                                    </Button>
                                    <Button className="buy-now-btn" onClick={handleBuyNow}>
                                        Mua ngay
                                    </Button>
                                </>
                            ) : (
                                <Button variant="secondary" disabled>
                                    Sản phẩm đã hết hàng
                                </Button>
                            )}
                        </div>
                    )}

                    <hr className="separator" />
                    <h4 style={{ marginTop: "10px" }} className="text-center">
                        Vận chuyển
                    </h4>
                    <img
                        style={{
                            width: "100%",
                            marginTop: "30px",
                            border: "1px black solid",
                        }}
                        src="/assets/user/image/ship.png"
                        alt="ship"
                        onError={(e) => {
                            console.error("Error loading shipping image:", e.target.src);
                            e.target.src = "/path/to/placeholder-image.png";
                        }}
                    />

                    <h4 style={{ marginTop: "30px" }} className="text-center">
                        Đổi hàng & Trả hàng
                    </h4>
                    <img
                        style={{
                            width: "100%",
                            marginTop: "30px",
                            border: "1px black solid",
                        }}
                        src="/assets/user/image/chinhsach.png"
                        alt="policy"
                        onError={(e) => {
                            console.error("Error loading policy image:", e.target.src);
                            e.target.src = "/path/to/placeholder-image.png";
                        }}
                    />
                </div>
            </div>
            <div>
                <RelateProduct products={listproduct} catid={product.idCat} id={product.idProduct} />
            </div>
        </div>
    );
};

export default ProductInfo;