import "../../../style/logIn_signUp_profile_Format.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import instance from "../../../utils/axiosInstance";

const LogIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const account = localStorage.getItem("account");
    if (account) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await instance.post("/auth/sign-in", { email, password });

      const { accessToken, refreshToken, user } = response.data;

      if (user.status === "Active") {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("account", JSON.stringify(user));

        alert("Đăng nhập thành công!");
        navigate("/");
        window.location.reload();
      } else {
        alert("Tài khoản bị vô hiệu hóa");
      }
    } catch (error) {
      alert("Sai email hoặc mật khẩu");
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="log-in-container">
        <img
          className="background-img"
          src="assets/user/image/background_login.jpg"
          alt="Background"
        />
        <div className="form-container">
          <p
            style={{
              fontSize: "50px",
              letterSpacing: "2px",
              margin: "20px 0",
            }}
          >
            ĐĂNG NHẬP
          </p>
          <form className="login-info" onSubmit={handleLogin}>
            <div className="input-container">
              <span>Email: &nbsp;</span>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <span>Mật khẩu: &nbsp;</span>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="login-act">
              <button className="sign-in btn">Đăng nhập</button>
              <p>
                Bạn không có tài khoản?
                <button
                  className="sign-up-now"
                  onClick={() => navigate("/sign-up")}
                >
                  Đăng kí ngay!
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogIn;