import { useState, useEffect, useContext} from "react";
import "../../style/productInfomation.css";
import { Button } from "react-bootstrap";
import RelateProduct from "./RelateProduct";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const ProductInfo=({product, listproduct})=>{
    //ảnh minh họa sản phẩm
    const [selectedImage, setSelectedImage] = useState(
        product.images && product.images.length > 0 ? product.images[0].imageLink : ""
      );
    // quản lý kho hàng
    const [quantity, setQuantity] = useState(1);
    
    //chọn size
    const sizes = ["S", "M", "L", "XL"];
    const [selectedSize, setSelectedSize] = useState("S");

    useEffect(() => {
        if (product.images && product.images.length > 0) {
          setSelectedImage(product.images[0].imageLink);
        }
      }, [product.idProduct]);

    // sử dụng để thêm vào giỏ hàng
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
        setQuantity((prev) => {
            if (type === "increase") {
                //nếu số lượng hiện tại < số lượng còn trong kho => tăng thêm 1.
                //nếu đã đạt tối đa => giữ nguyên.
                return prev < product.in_stock ? prev + 1 : prev;
            } else {
                //nếu số lượng lớn hơn 1, giảm đi 1.
                //nếu số lượng bằng 1, giữ nguyên <0 giảm về 0 để tránh lỗi mua hàng>.
                return prev > 1 ? prev - 1 : 1;
            }
        });
    };

    const navigate = useNavigate();

    const handleBuyNow = () => {
        const selectedProduct = { ...product, quantity };
        navigate("/checkout", { state: { selectedCartItems: [selectedProduct] } });
    };

    return(
        <div>
            <div className="product-infomation">
                <div className="product-img">
                    <div className="selected-img">
                        <img src={selectedImage} alt="Main image product"/>
                    </div>

                    <div className="other-img">
                        {product.images && product.images.map((image, index) => (
                            <img 
                                key={index}
                                src={image.imageLink}
                                alt="Product img"
                                onClick={() => setSelectedImage(image.imageLink)}
                                className={`thumbnail ${
                                    selectedImage === image.imageLink ? "active" : ""
                                }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="product-detail">
                    <h2>{product.name}</h2>
                    <h5>
                        Mã sản phẩm: {product.idProduct} | Tình trạng:{" "}
                        {product.in_stock > 0 ? "Còn Hàng" : "Hết Hàng"}
                    </h5>

                    <small className="text-muted" >
                        Số lượng đã bán:   {product.sold_quantity}
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
                                                    ((product.price - product.sale_price) /
                                                        product.price) *
                                                    100
                                                )}
                                                %
                                            </span>
                                        </>
                                    ) : (
                                        <span className="price" style={{fontSize: "24px", fontWeight: "bold"}}>{product.price}₫</span>
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
                                                {selectedSize === size && <i class="bi bi-check checkmark"></i>}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td>Số lượng:</td>
                                <td>
                                    <div className="quantity-selector">
                                        <Button
                                            variant="light"
                                            onClick={() => handleQuantityChange("decrease")}
                                        >
                                            <i className="bi bi-dash-lg"></i>
                                        </Button>
                                        <span className="quantity-display">{quantity}</span>
                                        <Button
                                            variant="light"
                                            onClick={() => handleQuantityChange("increase")}
                                            disabled={quantity >= product.in_stock}
                                        >
                                            <i className="bi bi-plus-lg"></i>
                                        </Button>
                                    </div>
                                    <small className="text-muted" style={{marginLeft: "10px"}}>
                                        {product.in_stock} sản phẩm có sẵn
                                    </small>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "10px",
                            marginTop: "20px",
                        }}
                    >
                        <Button className="add-to-cart-btn" onClick={handleAddToCart}>
                            Thêm vào giỏ
                        </Button>
                        <Button 
                            className="buy-now-btn"
                            onClick={handleBuyNow}
                        >   Mua ngay </Button>
                    </div>

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
                        alt="ship"
                    />
                </div>
            </div>
            <div>
                <RelateProduct
                    products={listproduct}
                    catid={product.idCat}
                    id={product.idProduct}
                ></RelateProduct>
            </div>
        </div>
    )
}

export default ProductInfo