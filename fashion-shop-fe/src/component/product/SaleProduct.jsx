import ProductList from "./ProductList"

const SaleProduct = ({products, title}) =>{
    return(
        <div style={{
            backgroundColor: "#FAEFEC"
        }}>
            <div className="headline">
                <h3> {title} </h3>
            </div>
            <ProductList
                products={products}
                title={title}
                btnhref = "/products/sale"
            />

            {/* <div className="headline">
                <a href="/products/sale" style={{
                    padding: "10px 20px",
                    fontFamily: "Inter",
                    fontStyle: "normal",
                    fontSize: "16px",
                    textAlign: "center",
                    color: "#000000",
                    border: "2px solid black",
                    borderRadius: "8px",
                    textTransform: "uppercase",
                }}> 
                    Xem tất cả sản phẩm {title}
                </a>
            </div> */}
        </div>
    )
}

export default SaleProduct