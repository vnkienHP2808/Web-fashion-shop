import "../../../style/logIn_signUp_profile_Format.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

const LogIn= ()=>{
    const navigate = useNavigate();
    //set email, password để check
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [users, setUsers] = useState([]); // thấy thông tin người đăng nhập trong db.json
    useEffect(() => {
        fetch("/db.json")
            .then((response) => response.json())
            .then((data) => {
                setUsers(data.users);
            })
            .catch((error) => console.error("Error loading data:", error));
    }, []);

    useEffect(() => {
        const account = sessionStorage.getItem("account"); //lấy dữ liệu tài khoản từ sessionStorage
        if (account) { //nếu đã đăng nhập
          navigate("/"); //điều hướng về trang chủ
        }
    }, [navigate]); // useEffect phụ thuộc vào navigate
    

    //xử lý việc check thông tin nhập vào với db.json để xem xét đăng nhập
    const handleLogin = (e) => {
        e.preventDefault();
        let check = false;
        for (let u of users) {
            if (email === u.email && password === u.password) {
                console.log("Đăng nhập thành công");
                sessionStorage.setItem("account", JSON.stringify(u));
                console.log(JSON.stringify(u));
                alert("Đăng nhập thành công!");
                check = true;
                navigate("/"); // sau khi đăng nhập thành công thì chuyển hướng sang trang chủ
                break;
            }
        }
        if (!check) {
            alert("Sai email hoặc mật khẩu");
        }
    };
    return(
        <div style={{
            width: "100%",
        }}>
            <div className="log-in-container">
                <img className="background-img" src="assets/user/image/background_login.jpg" alt="Background"/>
                <div className="form-container">
                    <p style={{
                        fontSize: "50px", 
                        letterSpacing: "2px",
                        margin: "20px 0",
                    }}>ĐĂNG NHẬP</p>
                    
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
                            <button className="sign-in btn">
                                Đăng nhập
                            </button>

                            <button className="forgot-password"
                                    onClick={()=> navigate("/resetPW")}>
                                Quên mật khẩu?
                            </button>

                            <p>
                                Bạn không có tài khoản?
                                <button className="sign-up-now"
                                        onClick={()=> navigate("/sign-up")}> 
                                    Đăng kí ngay!
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LogIn