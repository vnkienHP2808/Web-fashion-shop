import "../../../style/logIn_signUp_profile_Format.css";
import { useNavigate } from "react-router-dom";
import React, { useState , useEffect} from 'react';
import axios from "axios";

const SignUp =()=>{
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState([]);
    const navigate = useNavigate();

    const [users, setUsers] = useState([]); // thấy thông tin người đăng nhập trong db.json
    useEffect(()=>{
        axios.get("http://localhost:9999/users").then((res)=>{
            setUsers(res.data);
        });
    },[]);

    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(password===passwordRepeat){
            const userData = {
                id: users.length + 1,
                username,
                email,
                password,
                phonenumber,
                address : [address],
                role: "customer",
                status: "Active"
            };
            try {
                // Send POST request to save the user
                const response = await axios.post("http://localhost:9999/users", userData);
                alert("Đăng ký thành công!"); 
            } catch (err) {
                alert("Có lỗi xảy ra trong quá trình đăng ký."); 
            }
        }else{
            alert("Mật khẩu nhập lại không chính xác");
        }
        
    };

    return(
        <div style={{
            width: "100%",
        }}>
            <div className="log-in-container">
                <img className="background-img" src="assets/user/image/background_login.jpg" alt="Background"/>
                <div className="form-container" style={{height: "550px"}}>
                    <p style={{
                        fontSize: "50px", 
                        letterSpacing: "2px",
                        margin: "20px 0",
                    }}>ĐĂNG KÝ</p>
                    
                    <form className="login-info" onSubmit={handleSubmit}>
                        <div className="input-container">
                            <span>Nhập tên của bạn:</span>
                            <input 
                                type="text"
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="input-container">
                            <span>Email:</span>
                            <input 
                                type="email" 
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-container">
                            <span>Mật khẩu:</span>
                            <input 
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-container">
                            <span> Nhập lại mật khẩu:</span>
                            <input 
                                type="password"
                                onChange={(e) => setPasswordRepeat(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-container">
                            <span>Số điện thoại:</span>
                            <input 
                                type="tel"
                                maxLength={10}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-container">
                            <span>Địa chỉ:</span>
                            <input 
                                type="text"
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login-act">
                            <button className="sign-in btn"
                                    onClick={()=> navigate("/sign-in")}
                            >
                                Đăng ký
                            </button>
                            <p>
                                Bạn đã có tài khoản?
                                <button className="sign-in-now"
                                        onClick={()=> navigate("/sign-in")}
                                > 
                                    Đăng nhập ngay!
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUp