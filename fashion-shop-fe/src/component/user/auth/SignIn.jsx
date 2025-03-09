import "../../../style/logIn_signUp_profile_Format.css";
import { useNavigate } from "react-router-dom";

const LogIn= ()=>{
    const navigate = useNavigate();
    return(
        <div style={{
            marginTop: "96px",
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
                    
                    <div className="login-info">
                        <div className="input-container">
                            <span>Email: &nbsp;</span>
                            <input type="email" required/>
                        </div>

                        <div className="input-container">
                            <span>Mật khẩu: &nbsp;</span>
                            <input type="password" required/>
                        </div>

                        <div className="login-act">
                            <button className="sign-in btn"
                                    onClick={()=> navigate("/")}>
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogIn