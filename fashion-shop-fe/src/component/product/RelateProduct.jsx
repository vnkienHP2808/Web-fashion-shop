import ProductCard from "./ProductCard";
import "../../style/productFormat.css";

const RelateProduct=({products, catid, id}) =>{
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
                        <a
                            href={`/products/${product.id}`}
                            style={{textDecoration: "none"}}
                            key={index}
                        >
                            <ProductCard
                                products={product}
                                index={index}
                            ></ProductCard>
                        </a>
                ))}
            </div>
        </div>
    )
}

export default RelateProduct