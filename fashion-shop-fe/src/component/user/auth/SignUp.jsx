import "../../../style/logIn_signUp_profile_Format.css";
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import axios from "axios";

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== passwordRepeat) {
            alert("Mật khẩu nhập lại không chính xác");
            return;
        }

        const payload = {
            name: username,
            email: email,
            password: password,
            phones: [phonenumber],
            addresses: [address],
        };

        try {
            const response = await axios.post("http://localhost:8080/api/auth/sign-up", payload);
            alert("Đăng ký thành công!");
            navigate("/sign-in"); // điều hướng đến đăng nhập sau khi đăng ký
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra trong quá trình đăng ký.");
        }
    };

    return (
        <div style={{ width: "100%" }}>
            <div className="log-in-container">
                <img className="background-img" src="assets/user/image/background_login.jpg" alt="Background"/>
                <div className="form-container" style={{ height: "550px" }}>
                    <p style={{
                        fontSize: "50px",
                        letterSpacing: "2px",
                        margin: "20px 0",
                    }}>ĐĂNG KÝ</p>

                    <form className="login-info" onSubmit={handleSubmit}>
                        <div className="input-container">
                            <span>Nhập tên của bạn:</span>
                            <input type="text" onChange={(e) => setUsername(e.target.value)} required />
                        </div>

                        <div className="input-container">
                            <span>Email:</span>
                            <input type="email" onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <div className="input-container">
                            <span>Mật khẩu:</span>
                            <input type="password" onChange={(e) => setPassword(e.target.value)} required />
                        </div>

                        <div className="input-container">
                            <span>Nhập lại mật khẩu:</span>
                            <input type="password" onChange={(e) => setPasswordRepeat(e.target.value)} required />
                        </div>

                        <div className="input-container">
                            <span>Số điện thoại:</span>
                            <input type="tel" maxLength={10} onChange={(e) => setPhoneNumber(e.target.value)} required />
                        </div>

                        <div className="input-container">
                            <span>Địa chỉ:</span>
                            <input type="text" onChange={(e) => setAddress(e.target.value)} required />
                        </div>

                        <div className="login-act">
                            <button className="sign-in btn" type="submit">
                                Đăng ký
                            </button>
                            <p>
                                Bạn đã có tài khoản?
                                <button className="sign-in-now" type="button" onClick={() => navigate("/sign-in")}>
                                    Đăng nhập ngay!
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
