import "../../style/productFormat.css"


const ProductCard=({product_demo})=>{
    return(
        <div className="product-card-container">
            <img
                className="product-card-img"
                src={product_demo.images[0]}
                 alt={product_demo.name}
            />
            <div className="product-card-info">
                <a href="" className="product-cat">
                    {product_demo.category}
                </a>
                <a href="" className="product-name">
                    {product_demo.name}
                </a>
                <div className="product-price">
                    {product_demo.price}
                </div>
            </div>
        </div>

    )
}

export default ProductCard