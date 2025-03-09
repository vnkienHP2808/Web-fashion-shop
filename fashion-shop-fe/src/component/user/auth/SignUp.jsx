import "../../../style/logIn_signUp_profile_Format.css";
import { useNavigate } from "react-router-dom";

const SignUp =()=>{
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
                    }}>ĐĂNG KÝ</p>
                    
                    <div className="login-info">
                        <div className="input-group">
                            <div className="input-container-name-signup">
                                <span>Họ:</span>
                                <input type="text" required/>
                            </div>

                            <div className="input-container-name-signup">
                                <span>Tên:</span>
                                <input type="text" required/>
                            </div>
                        </div>
                        
                        <div className="input-container">
                            <span>Email:</span>
                            <input type="email" required/>
                        </div>

                        <div className="input-container">
                            <span>Mật khẩu:</span>
                            <input type="password" required />
                        </div>

                        <div className="input-container">
                            <span> Nhập lại mật khẩu:</span>
                            <input type="password" required/>
                        </div>

                        <div className="login-act">
                            <button className="sign-in btn"
                                    onClick={()=> navigate("/")}>
                                Đăng ký
                            </button>
                            <p>
                                Bạn không có tài khoản?
                                <button className="sign-in-now"
                                        onClick={()=> navigate("/sign-in")}> 
                                    Đăng nhập ngay!
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp