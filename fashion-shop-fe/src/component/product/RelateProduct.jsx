import ProductCard from "./ProductCard";
import "../../style/productFormat.css";
import { useNavigate } from "react-router-dom";
import AllButton from "../ui/AllButton";
const RelateProduct = ({ products, catid, id }) => {
    const navigate = useNavigate();
    return (
        <div className="relate-product-container" style={{ backgroundColor: "#FAEFEC" }}>
            <div className="headline">
                <h3>Sản phẩm liên quan</h3>
            </div>
            <div className="product-list-grid">
                {products
                    .filter(
                        (product) => product.idProduct !== id && product.idCat === catid
                    )
                    .slice(0, 8)
                    .map((product, index) => (
                        <div
                            onClick={() => navigate(`/products/${product.idProduct}`)}
                            style={{ textDecoration: "none", cursor: "pointer" }}
                            key={index}
                        >
                            <ProductCard
                                products={product}
                                index={index}
                            ></ProductCard>
                        </div>
                    ))}
            </div>
            <div>
                <AllButton
                    text={"Xem tất cả sản phẩm liên quan".toUpperCase()}
                    href={`http://localhost:5173/products/category/${catid}`}
                />
            </div>
        </div>
    )
}

export default RelateProduct