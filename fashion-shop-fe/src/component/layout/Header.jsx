import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/header.css"
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import { CartContext } from "../../context/CartContext";

const Header = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const isLoggedIn = sessionStorage.getItem("account") !== null;
    const loggedInUser = JSON.parse(sessionStorage.getItem("account"));
    const [searchTerm, setSearchTerm] = useState("");

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

    const { cart } = useContext(CartContext);
    const totalItems = Array.isArray(cart)
        ? new Set(cart.map(item => `${item.product.idProduct}-${item.size}`)).size
        : 0;


    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate("/search", {
                state: { searchTerm: searchTerm },
            });
        }
        else{
            console.log("Search term is empty or invalid");
        }
    };

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
                    <li><a href="/products/new">Hàng mới về</a></li>
                    <li><a href="/products/sale">Hàng giảm giá</a></li>
                    <li>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                        }}>
                            <a href="/products/all" style={{marginRight:"5px"}}>Sản phẩm</a>
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
            <form onSubmit={handleSearch}>
                <div className="d-flex justify-content-center align-items-center gap-2">
                    <i className="bx bx-search-alt-2 fs-4"></i>
                    <input
                        type="text"
                        className="form-control"
                        style={{ width: "250px" }}
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </form>

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
                <span style={{ cursor: "pointer"}}>
                    {isLoggedIn ? (
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
                                {loggedInUser.role === "Admin" && (
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
            </div>
        </div>
    );
};

export default Header;