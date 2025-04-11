import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/header.css"
import axios from "axios";
import { Dropdown} from "react-bootstrap";
import { CartContext } from "../../context/CartContext";
const Header = () => {
    const navigate = useNavigate(); // hàm điều hướng
    const [categories, setCategories] = useState([]); // dùng để lấy dữ liệu trong db.json mục categories
    const isLoggedIn = sessionStorage.getItem("account") !== null; // check đăng nhập
    const loggedInUser = JSON.parse(sessionStorage.getItem("account")); // lấy thông tin tài khoản trong db.json
    //categoríe in db.json
    useEffect(() => {
        axios.get("http://localhost:8080/api/categories")
          .then((res) => setCategories(res.data))
          .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("account");
        alert("Bạn đã đăng xuất");
        navigate("/");
    };
    console.log(isLoggedIn);

    // set số lượng sp trong cart
    const { cart } = useContext(CartContext);
    const totalItems = new Set(cart.map(item => item.id)).size; 
    // hiện số lượng trong giỏ hàng theo số sp trong giỏ
    // Set để giữ id duy nhất
    return (
        <div className="header">
            {/* Logo */}
            <div style={{ fontFamily: "Irish Grover", fontStyle: "normal", fontWeight: "bolder", letterSpacing: "20px" }}>
                <h1>ELYTS</h1>
            </div>

            {/* Menu */}
            <div className="d-flex justify-content-center align-items-center">
                <ul className="bar list-unstyled d-flex align-items-center gap-5 m-0 pt-3">
                    <li><a href="/">Trang chủ</a></li>
                    <li><a href="/products/new">Hàng mới về</a></li> {/* "/products/new" */}
                    <li><a href="/products/sale">Hàng giảm giá</a></li> {/* "/products/sale" */}
                    <li> {/* "/products/all" */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                        }}>
                        <a href="/products/all" style={{marginRight:"5px"}}>Sản phẩm</a>
                        {/* bảng chọn loại sản phẩm */}
                        <Dropdown>
                            <Dropdown.Toggle
                                variant="light"
                                id="dropdown-basic"
                                style={{
                                    border: "none",
                                    backgroundColor: "transparent",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    padding: "0",
                                }}
                            ></Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-menu-category">
                                {categories.map((category, index) => (
                                    <Dropdown.Item href={`/products/category/${category.id}`} key={index}>
                                        {category.name}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Search box */}
            <div className="d-flex justify-content-center align-items-center gap-2">
                <i className="bx bx-search-alt-2 fs-4"></i>
                <input type="text" className="form-control" style={{ width: "250px" }} placeholder="Tìm kiếm..." />
            </div>

            {/* Icons */}
            <div className="icon-container">
                {/* Cart */}
                {loggedInUser !== null && loggedInUser.role === "Customer" && (
                    <span style={{ cursor: "pointer", position: "relative"}}>
                        <div>
                            <i className="bx bx-cart-alt fs-3" onClick={() => navigate("/cart")}></i>
                            {totalItems > 0 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: "5px",
                                        right: "2px",
                                        background: "red",
                                        color: "white",
                                        borderRadius: "50%",
                                        width: "15px",
                                        height: "15px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        lineHeight: "18px",
                                        transform: "translate(50%, -50%)"
                                    }}
                                >
                                    {totalItems}
                                </span>
                            )}
                        </div>
                    </span> 
                )}    
                {/* Account */}
                <span
                    style={{ cursor: "pointer"}}
                >
                    {isLoggedIn ? ( // check đã đăng nhập
                        <Dropdown>
                            <Dropdown.Toggle variant="link" id="dropdown-basic" className="text-dark">
                                <i className="bx bx-user fs-3" style={{color: "black"}}></i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {loggedInUser.role === "Customer" && ( 
                                    <Dropdown.Item onClick={() => navigate("/profile")}>
                                        Tài khoản
                                    </Dropdown.Item>
                                )}
                                {loggedInUser.role === "Customer" && ( 
                                    <Dropdown.Item onClick={() => navigate("/myorder")}>
                                        Đơn hàng
                                    </Dropdown.Item>
                                )}
                                {loggedInUser.role === "Admin" && ( 
                                    <Dropdown.Item onClick={() => navigate("/profile")}>
                                        Tài khoản
                                    </Dropdown.Item>
                                )}
                                {loggedInUser.role === "Admin" && ( // route quản lý về user, product hay order
                                    <Dropdown.Item onClick={() => navigate("/admin")}>
                                        Quản lý
                                    </Dropdown.Item>
                                )}
                                <Dropdown.Item onClick={handleLogout}>
                                    Đăng xuất
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <Dropdown>
                            <Dropdown.Toggle variant="link" id="dropdown-basic" className="text-dark">
                                <i className="bx bx-user fs-3" style={{color: "black"}}></i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => navigate("/sign-in")}>
                                    Đăng nhập
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </span>

                {/* <div className="vr mx-3 align-self-center" style={{ height: "50%" }}></div> */}
                {/* Login button
                <div className="log_in">
                    <button
                        className="login btn"
                        style={{ borderRadius: "8px" }}
                        onClick={() => navigate("/sign-in")} // bấm chuyển sang đăng nhập
                    >
                        Đăng nhập
                    </button>
                </div> */}
            </div>


        </div>
    );
};

export default Header;
