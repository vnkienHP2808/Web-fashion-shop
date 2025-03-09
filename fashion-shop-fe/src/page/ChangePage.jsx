import Header from "../component/layout/Header";
import Footer from "../component/layout/Footer";
import React from "react";
import SetPassword from "../component/user/auth/ChangePw";
const ChangePassword = ()=>{
    return(
        <div className="page-container">
            <Header></Header>
            <SetPassword></SetPassword>
            <Footer></Footer>
        </div>
    )
}

export default ChangePassword