import ProductList from "./ProductList"
import "../../style/fontWomanDay.css"
const SaleProduct = ({products, title}) =>{
    return(
        <div style={{
            backgroundColor: "#FAEFEC"
        }}>
            <div className="headline">
                <h3 style={{ 
                    fontFamily: "'Great Vibes', cursive",
                    border: "none",
                    fontSize: "60px",
                    letterSpacing: "5px",
                }}> Woman's Day Sale </h3>
            </div>
            <ProductList
                products={products}
                title={title}
                filterFn={(product) => product.isSale}
                isShowAll={false}
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