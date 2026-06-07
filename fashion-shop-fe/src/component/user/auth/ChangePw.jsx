

import "../../../style/logIn_signUp_profile_Format.css";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import instance from "../../../utils/axiosInstance"

const SetPassword = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("account"));

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChangePassword = async () => {
        setErrorMessage("");
        setSuccessMessage("");

        if (newPassword !== confirmPassword) {
            setErrorMessage("Nhập lại mật khẩu không đúng.");
            return;
        }

        try {
            await instance.post("/auth/change-password", {
                userId: user.id_user,
                oldPassword: oldPassword,
                newPassword: newPassword
            });

            setSuccessMessage("Đổi mật khẩu thành công!");
            setTimeout(() => navigate("/profile"), 2000);
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Đổi mật khẩu thất bại!";
            setErrorMessage(errorMsg);
            console.error("Lỗi khi đổi mật khẩu:", error.response?.data);
        }
    };

    return (
        <div style={{ width: "100%" }}>
            <div className="log-in-container">
                <img className="background-img" src="assets/user/image/background_profile.jpg" alt="Background" />
                <div className="form-container" style={{ backgroundColor: "rgba(238, 219, 196, 0.6)" }}>
                    <p style={{ fontSize: "50px", letterSpacing: "2px", marginTop: "20px", marginBottom: "10px" }}>
                        ĐỔI MẬT KHẨU
                    </p>

                    <div>
                        <div className="profile-info">
                            <div className="profile-img">
                                <i className="bi bi-person-circle" style={{ fontSize: "150px", margin: "0 10px" }}></i>
                            </div>

                            <div className="profile-text">
                                <div className="input-container-profile">
                                    <span>Mật khẩu cũ:</span>
                                    <input
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="input-container-profile">
                                    <span>Mật khẩu mới:</span>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="input-container-profile">
                                    <span>Xác nhận mật khẩu:</span>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {errorMessage && <p style={{ color: "red", marginTop: "10px", fontSize: "25px" }}>{errorMessage}</p>}
                                {successMessage && <p style={{ color: "green", marginTop: "10px", fontSize: "25px" }}>{successMessage}</p>}
                            </div>
                        </div>

                        <div className="profile-act">
                            <button className="set-up" onClick={handleChangePassword}>
                                CẬP NHẬT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetPassword;