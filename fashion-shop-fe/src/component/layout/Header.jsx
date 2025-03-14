import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/header.css"
import { Dropdown} from "react-bootstrap";

const Header = () => {
    const navigate = useNavigate(); // hàm điều hướng
    const [categories, setCategories] = useState([]); // dùng để lấy dữ liệu trong db.json mục categories
    const isLoggedIn = sessionStorage.getItem("account") !== null; // check đăng nhập
    const loggedInUser = JSON.parse(sessionStorage.getItem("account")); // lấy thông tin tài khoản trong db.json

    //categoríe in db.json
    useEffect(() => {
        fetch("/db.json")
            .then((response) => response.json())
            .then((data) => {
                setCategories(data.categories);
            })
            .catch((error) => console.error("Error loading data:", error));
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("account");
        alert("Bạn đã đăng xuất");
        navigate("/");
    };
    console.log(isLoggedIn);
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
                <span style={{ cursor: "pointer"}}>
                    <i className="bx bx-cart-alt fs-3" onClick={() => navigate("/cart")}></i>
                </span>     
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
                                {loggedInUser.role === "customer" && ( // khách thì tài khoản
                                    <Dropdown.Item onClick={() => navigate("/profile")}>
                                        Tài khoản
                                    </Dropdown.Item>
                                )}
                                {loggedInUser.role === "admin" && ( // admin thì điều hướng tới tài khoản riêng của admin
                                    <Dropdown.Item onClick={() => navigate("/profile")}>
                                        Tài khoản
                                    </Dropdown.Item>
                                )}
                                {loggedInUser.role === "admin" && ( // route quản lý về user, product hay order
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
                {/* {loggedInUser !== null && loggedInUser.role === "customer" && (
                    <span
                        style={{ cursor: "pointer",}}
                    >
                        <a href="/cart">
                            <i className="bx bx-cart-alt fs-3" onClick={() => navigate("/cart")}></i>
                            {totalItems > 0 && (
                                <span
                                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                    style={{ fontSize: "0.75rem" }}
                                >
                                    {totalItems}
                                </span>
                            )}
                        </a>
                    </span>
                )} */}

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
