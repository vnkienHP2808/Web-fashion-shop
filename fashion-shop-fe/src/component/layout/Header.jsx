import React from "react";
import { useNavigate } from "react-router-dom";
import "../../style/header.css"

const Header = () => {
    const navigate = useNavigate(); // hàm điều hướng
    return (
        <div className="header">
            {/* Logo */}
            <div style={{ fontFamily: "Irish Grover", fontStyle: "normal", fontWeight: "bolder", letterSpacing: "20px" }}>
                <h1>ELYTS</h1>
            </div>

            {/* Menu */}
            <div className="d-flex justify-content-center align-items-center">
                <ul className="bar list-unstyled d-flex align-items-center gap-4 m-0 pt-3">
                    <li><a href="/">Trang chủ</a></li>
                    <li><a href="index.html">Hàng mới về</a></li> {/* "/products/new" */}
                    <li><a href="index.html">Sản phẩm</a></li> {/* "/products/all" */}
                </ul>
            </div>

            {/* Search box */}
            <div className="d-flex justify-content-center align-items-center gap-2">
                <i className="bx bx-search-alt-2 fs-4"></i>
                <input type="text" className="form-control" style={{ width: "250px" }} placeholder="Tìm kiếm..." />
            </div>

            {/* Icons */}
            <div className="icon-container">
                {/* Login button */}
                <div className="log_in">
                    <button
                        className="login btn"
                        style={{ borderRadius: "8px" }}
                        onClick={() => navigate("/sign-in")} // bấm chuyển sang đăng nhập
                    >
                        Đăng nhập
                    </button>
                </div>

                <div className="vr mx-3 align-self-center" style={{ height: "50%" }}></div>

                {/* Cart */}
                <i className="bx bx-cart-alt fs-3" onClick={() => navigate("/cart")}></i>

                {/* User */}
                <i className="bx bx-user fs-3" onClick={() => navigate("/profile")}></i>

                {/* Notice */}
                <i className='bx bx-bell fs-3' onClick={() => navigate("/notice")}></i>
            </div>


        </div>
    );
};

export default Header;
