import ProductCard from "./ProductCard"
import "../../style/productFormat.css"

const ProductList =({product_demo})=>{
    return(
        <div className="product-list-container">
            <div className="headline">
                <h3>Hàng mới về</h3>
            </div>
            <div className="product-list-grid">
                {product_demo.slice(0,8).map((product, index) =>(
                    <ProductCard 
                        key={index}
                        product_demo={product}  
                        index={index} 
                    >
                    </ProductCard>
                ))}
            </div>
        </div>
    )
}

export default ProductList