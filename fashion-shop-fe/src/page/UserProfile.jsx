import Header from "../component/layout/Header";
import Footer from "../component/layout/Footer";
import React from "react";
import Profile from "../component/user/auth/Profile";
const UserProfile = ()=>{
    return(
        <div className="page-container">
            <Header></Header>
            <Profile></Profile>
            <Footer></Footer>
        </div>
    )
}

export default UserProfile