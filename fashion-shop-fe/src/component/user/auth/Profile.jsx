import "../../../style/logIn_signUp_profile_Format.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
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
                    }}>THÔNG TIN CÁ NHÂN</p>

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
                                    <span>Họ và tên:</span>
                                    <input type="text" required />
                                </div>

                                <div className="input-container-profile">
                                    <span>Địa chỉ:</span>
                                    <input type="text" required />
                                </div>

                                <div className="input-container-profile">
                                    <span>Email:</span>
                                    <input type="email" required />
                                </div>
                            </div>
                        </div>

                        <div className="profile-act">
                            <button className="set-up" style={{
                                marginRight: "53px",
                            }} onClick={() => navigate("/profile")} >
                                CẬP NHẬT
                            </button>

                            <button className="change-password"
                                    onClick={()=> navigate("/change-password")}>
                                ĐỔI MẬT KHẨU
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile

// còn phải thay đổi ảnh đại diện khi cần