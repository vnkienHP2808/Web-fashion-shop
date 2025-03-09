import "../../../style/logIn_signUp_profile_Format.css";
import { useNavigate } from "react-router-dom";

const SetPassword = () => {
    const navigate = useNavigate();
    return (
        <div style={{
            marginTop: "96px",
            width: "100%",
        }}>
            <div className="log-in-container">
                <img className="background-img" src="assets/user/image/background_profile.jpg" alt="Background" />
                <div className="form-container" style={{
                    backgroundColor: "rgba(238, 219, 196, 0.6)",
                }}>
                    <p style={{
                        fontSize: "50px",
                        letterSpacing: "2px",
                        marginTop: "20px",
                        marginBottom: "10px",
                    }}>ĐỔI MẬT KHẨU</p>

                    <div>
                        <div className="profile-info">
                            <div className="profile-img">
                                <i className="bi bi-person-circle" style={{
                                    fontSize: "150px",
                                    margin: "0 10px"
                                }}></i>
                            </div>

                            <div className="profile-text">
                                <div className="input-container-profile">
                                    <span>Mật khẩu cũ:</span>
                                    <input type="password" required />
                                </div>

                                <div className="input-container-profile">
                                    <span>Mật khẩu mới:</span>
                                    <input type="password" required />
                                </div>

                                <div className="input-container-profile">
                                    <span>Mật khẩu mới:</span>
                                    <input type="password" required />
                                </div>
                            </div>
                        </div>

                        <div className="profile-act">
                            <button className="set-up" onClick={() => navigate("/profile")}>
                                CẬP NHẬT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SetPassword
