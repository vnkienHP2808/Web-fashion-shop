import ProductCard from "./ProductCard"
import "../../style/productFormat.css"

const ProductList =({product_new_sale, title})=>{
    return(
        <div 
            className="product-list-container"
            style={{
                backgroundColor: title === "Hàng mới về" ? "white" : "#FAEFEC"
            }}      
        >
            <div className="headline">
                <h3> {title} </h3>
            </div>
            <div className="product-list-grid">
                {product_new_sale.slice(0,8).map((product, index) =>(
                    <ProductCard 
                        key={index}
                        product_new_sale={product}  
                        index={index} 
                        /*type để phân biệt tính chất hàng, title để set type*/
                        type = {
                            title === "Hàng mới về" ? "New" :
                            title === "Giảm giá" ? "Sale" : ""
                        }
                    >
                    </ProductCard>
                ))}
            </div>
        </div>
    )
}

export default ProductList