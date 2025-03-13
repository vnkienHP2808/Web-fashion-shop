import ProductCard from "./ProductCard";
import "../../style/productFormat.css";
import { useNavigate } from "react-router-dom";

const RelateProduct=({products, catid, id}) =>{
    const navigate = useNavigate();
    return(
        <div className="relate-product-container" style={{backgroundColor: "#FAEFEC"}}>
            <div className="headline">
                <h3>Sản phẩm liên quan</h3>
            </div>
            <div className="product-list-grid">
                {products
                    .filter(
                        (product) => product.id !== id && product.categoryId === catid
                    )
                    .slice(0, 8)
                    .map((product, index)=>(
                        <div
                            onClick={() => navigate(`/products/${product.id}`)}
                            style={{textDecoration: "none", cursor: "pointer"}}
                            key={index}
                        >
                            <ProductCard
                                products={product}
                                index={index}
                            ></ProductCard>
                        </div>
                ))}
            </div>
        </div>
    )
}

export default RelateProduct