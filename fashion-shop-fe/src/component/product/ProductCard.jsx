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
                <h6 style={{
                    fontSize:"16px",
                    fontWeight:"bold",
                    textAlign:"center",
                    color:"white",
                }}>
                    {product_demo.name}
                </h6>
            </div>
        </div>

    )
}

export default ProductCard