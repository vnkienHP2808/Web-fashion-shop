import "../../style/logIn_signUp_profile_Format.css"

const LogIn= ()=>{
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
                        letterSpacing: "5px",
                        margin: "20px 0",
                    }}>ĐĂNG NHẬP</p>
                    
                    <div className="login-info">
                        <div className="input-container">
                            <span>Email: &nbsp;</span>
                            <input type="text"/>
                        </div>

                        <div className="input-container">
                            <span>Mật khẩu: &nbsp;</span>
                            <input type="password"/>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default LogIn