import Header from "../component/layout/Header";
import Footer from "../component/layout/Footer";
import LogIn from "../component/ui/LogIn";
import React from "react";
const LogInPage = ()=>{
    return(
        <div className="page-container">
            <Header></Header>
            <LogIn></LogIn>
            <Footer></Footer>
        </div>
    )
}

export default LogInPage