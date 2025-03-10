import React, { useState} from "react";
import ProductCard from "./ProductCard"
import "../../style/productFormat.css"
import AllButton from "../ui/AllButton"

const ProductList =({products, filterFn, title, isShowAll, btnhref})=>{
    // set số lượng sản phẩm muốn đưa ra
    const [itemsToShow] = useState(8);
    return(
        <div 
            className="product-list-container"      
        >
            {/* title chuyển sang file khác */}
            {!isShowAll ? (
                <>
                    <div className="product-list-grid">
                        {products
                            .filter(
                                (product) => product.status === "Activate" && filterFn(product)
                            )
                            .slice(0, itemsToShow)
                            .map((product, index) =>(
                                <a
                                    href={`/products/${product.id}`}
                                    style={{ textDecoration: "none" }}
                                >
                                    <ProductCard 
                                        key={index}
                                        products={product}  
                                        index={index} 
                                        /*type để phân biệt tính chất hàng, title để set type*/
                                        type = {
                                            title === "Hàng mới về" ? "New" :
                                            title === "Hàng giảm giá" ? "Sale" : ""
                                        }
                                    >
                                    </ProductCard>
                                </a>
                            )
                        )}
                    </div>
                    <div>
                        <AllButton
                            text={`Xem tất cả ${title}`.toUpperCase()}
                            href={btnhref}
                        />
                        {/* đã chuyển button sang file AllButton */}
                    </div>
                </>
            ) : (
                <>
                    <div className="product-list-grid">
                        {products
                            .filter(
                                (product) => product.status === "Activate" && filterFn(product)
                            )
                            .map((product, index) => (
                                <a 
                                    href={`/products/${product.id}`}
                                    style={{textDecoration: "none"}}
                                >   
                                    <ProductCard
                                        key={index}
                                        products={product}
                                        index={index}
                                        type = {
                                            title === "Hàng mới về" ? "New" :
                                            title === "Hàng giảm giá" ? "Sale" : ""
                                        }
                                    ></ProductCard>
                                </a>
                            ))
                        }
                    </div>
                </>
            )}
        </div>
    )
}

export default ProductList