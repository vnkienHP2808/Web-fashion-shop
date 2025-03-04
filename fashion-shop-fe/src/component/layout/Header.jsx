import React from "react";

import "../../style/header.css"

const Header = () => {
    return (
        <div className="header">
            {/* Logo */}
            <div style={{ fontFamily: "Irish Grover", fontStyle: "normal", fontWeight: "bolder", letterSpacing: "20px" }}>
                <h1>ELYTS</h1>
            </div>

            {/* Menu */}
            <div className="d-flex justify-content-center align-items-center">
                <ul className="bar list-unstyled d-flex align-items-center gap-4 m-0 p-0">
                    <li><a href="index.html">Trang chủ</a></li>
                    <li><a href="index.html">Hàng mới về</a></li>
                    <li><a href="index.html">Sản phẩm</a></li>
                </ul>
            </div>

            {/* Search box */}
            <div className="d-flex justify-content-center align-items-center gap-2">
                <i className="bx bx-search-alt-2 fs-4"></i>
                <input type="text" className="form-control" style={{ width: "250px" }} placeholder="Tìm kiếm..." />
            </div>

            {/* Icons */}
            <div className="d-flex justify-content-center align-items-center gap-2">
                {/* Login button */}
                <div className="log_in">
                    <a href="url3.html" className="login btn" style={{ borderRadius: "8px" }}> Đăng nhập </a>
                </div>

                <div className="vr mx-3 align-self-center" style={{ height: "50%" }}></div>

                {/* Cart */}
                <a href="url4.html">
                    <i className="bx bx-cart-alt fs-3"></i>
                </a>

                {/* User */}
                <a href="url4.html">
                    <i className="bx bx-user fs-3"></i>
                </a>

                {/* Notice */}
                <a href="url4.html">
                    <i className='bx bx-bell fs-3'></i>
                </a>
            </div>
        </div>
    );
};

export default Header;
