import Header from "../component/layout/Header";
import Footer from "../component/layout/Footer";
import SignIn from "../component/user/auth/SignIn";
import React from "react";
const SignInPage = ()=>{
    return(
        <div className="page-container">
            <Header></Header>
            <SignIn></SignIn>
            <Footer></Footer>
        </div>
    )
}

export default SignInPage