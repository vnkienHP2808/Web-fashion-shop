import "../../../style/logIn_signUp_profile_Format.css";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const Profile = () => {
    const user = JSON.parse(sessionStorage.getItem("account"));
    const navigate = useNavigate();

    const phoneNumberOptions = user.phones || [];
    const addressOptions = user.addresses || [];

    const [selectedPhone, setSelectedPhone] = useState(phoneNumberOptions[0] || "");
    const [selectedAddress, setSelectedAddress] = useState(addressOptions[0] || "");
    
    return (
        <div style={{ width: "100%" }}>
            <div className="log-in-container">
                <img className="background-img" src="assets/user/image/background_profile.jpg" alt="Background" />
                <div className="form-container" style={{ backgroundColor: "rgba(238, 219, 196, 0.6)" }}>
                    <p style={{ fontSize: "50px", letterSpacing: "2px", marginTop: "20px", marginBottom: "10px" }}>
                        THÔNG TIN CÁ NHÂN
                    </p>

                    <div>
                        <div className="profile-info">
                            <div className="profile-img">
                                <i className="bi bi-person-circle" style={{ fontSize: "150px", margin: "0 10px" }}></i>
                            </div>

                            <div className="profile-text">
                                <div className="input-container-profile">
                                    <span>Họ và tên:</span>
                                    <p>{user.name}</p>
                                </div>

                                <div className="input-container-profile">
                                    <span>Email:</span>
                                    <p>{user.email}</p>
                                </div>

                                {user.role !== "Admin" && (
                                    <>
                                        <div className="input-container-profile">
                                            <span>Số điện thoại:</span>
                                            <select
                                                value={selectedPhone}
                                                onChange={(e) => setSelectedPhone(e.target.value)}
                                                className="select-address"
                                            >
                                                {phoneNumberOptions.map((phone, index) => (
                                                    <option key={index} value={phone}>
                                                        {phone}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-container-profile">
                                            <span>Địa chỉ:</span>
                                            <select
                                                value={selectedAddress}
                                                onChange={(e) => setSelectedAddress(e.target.value)}
                                                className="select-address"
                                            >
                                                {addressOptions.map((address, index) => (
                                                    <option key={index} value={address}>
                                                        {address}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="profile-act" style={{ marginTop: "30px" }}>
                            <button
                                className="set-up"
                                style={{ marginRight: "70px" }}
                                onClick={() => navigate("/profile")}
                            >
                                CẬP NHẬT
                            </button>

                            <button className="change-password" onClick={() => navigate("/change-password")}>
                                ĐỔI MẬT KHẨU
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
