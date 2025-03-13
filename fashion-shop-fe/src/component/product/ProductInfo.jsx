import { useState, useEffect} from "react";
import "../../style/productInfomation.css";
import { Button } from "react-bootstrap";
import RelateProduct
 from "./RelateProduct";
const ProductInfo=({product, listproduct})=>{
    const [selectedImage, setSelectedImage] = useState(
        product.images && product.images.length > 0 ? product.images[0] : ""
      );
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (product.images && product.images.length > 0) {
            setSelectedImage(product.images[0]);
        }
    }, [product.images]);

    const handleQuantityChange = (type) => {
        setQuantity((prev) => {
            if (type === "increase") {
                //nếu số lượng hiện tại < số lượng còn trong kho => tăng thêm 1.
                //nếu đã đạt tối đa => giữ nguyên.
                return prev < product.inStock ? prev + 1 : prev;
            } else {
                //nếu số lượng lớn hơn 1, giảm đi 1.
                //nếu số lượng bằng 1, giữ nguyên <0 giảm về 0 để tránh lỗi mua hàng>.
                return prev > 1 ? prev - 1 : 1;
            }
        });
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
                                src={image}
                                alt="Product img"
                                onClick={() => setSelectedImage(image)}
                                className={`thumbnail ${
                                    selectedImage === image ? "active" : ""
                                }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="product-detail">
                    <h2>{product.name}</h2>
                    <h5>
                        Mã sản phẩm: {product.id} | Tình trạng:{" "}
                        {product.inStock > 0 ? "Còn Hàng" : "Hết Hàng"}
                    </h5>

                    <table className="product-info-table">
                        <tbody>
                            <tr>
                                <td>Giá:</td>
                                <td>
                                    {product.salePrice != null && product.isSale ? (
                                        <>
                                            <span className="sale-price">{product.salePrice}₫</span>
                                            <span className="original-price">{product.price}₫</span>
                                            <span className="discount">
                                                <i className="bi bi-lightning-charge-fill"></i>-
                                                {Math.floor(
                                                    ((product.price - product.salePrice) /
                                                        product.price) *
                                                    100
                                                )}
                                                %
                                            </span>
                                        </>
                                    ) : (
                                        <span className="price">{product.price}₫</span>
                                    )}
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
                                            disabled={quantity >= product.inStock}
                                        >
                                            <i className="bi bi-plus-lg"></i>
                                        </Button>
                                    </div>
                                    <small className="text-muted" style={{marginLeft: "10px"}}>
                                        {product.inStock} sản phẩm có sẵn
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
                        <Button className="add-to-cart-btn">
                            Thêm vào giỏ
                        </Button>
                        <Button className="buy-now-btn">Mua ngay</Button>
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
                    catid={product.categoryId}
                    id={product.id}
                ></RelateProduct>
            </div>
        </div>
    )
}

export default ProductInfo