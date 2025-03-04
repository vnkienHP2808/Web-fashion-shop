import React from "react";
import "../../style/footer.css"

const Footer = ()=>{
    return(
        <div style={{ 
            backgroundColor: "#FAEFEC" // div to để lúc bo góc che đi màu trắng 
        }}>
            <div className="footer">
                <div className="row">
                    <div className="col">
                        <p className="logo"> ELYTS </p>
                        <p className="text-white"> 
                            ELYTS là website thời trang nữ cao cấp mang đến những thiết kế tinh tế, sang trọng cùng với chất liệu cao cấp, đường may tỉ mỉ và xu hướng mới nhất, ELYTS là điểm đến lý tưởng cho những tín đồ thời trang yêu thích sự thanh lịch và quý phái.
                        </p>
                    </div>
                    <div className="col">
                        <h2> Văn phòng </h2>
                        <p> <span className="fw-bold fs-6">Vị trí</span>: Km 10, Nguyễn Trãi, Mộ Lao, Hà Đông, Hà Nội, Việt Nam</p>
                        <p> <span className="fw-bold fs-6">Điện thoại</span>: +84 - 0123456789</p>
                        <p className="email-id"> <span className="fw-bold fs-6">Email</span> : laptrinhweb@gmail.com </p>
                    </div>
                    <div className="col">
                        <h2> Thông tin liên hệ </h2>
                        <ul>
                            <li><a href=""> Về chúng tôi </a></li>
                            <li><a href=""> Sự kiện </a></li>
                            <li><a href=""> Tin tức </a></li>
                            <li><a href=""> Dịch vụ </a></li>
                        </ul>
                    </div>
                    <div className="col">
                        <h2>Theo dõi chúng tôi </h2>
                        <ul>
                            <li>
                                <a href="">
                                    <p className="bi bi-facebook fs-5">&nbsp; Facebook </p>
                                </a>
                            </li>
                            <li>
                                <a href="">
                                    <p className="bi bi-instagram fs-5">&nbsp; Instagram </p>
                                </a>
                            </li>
                            <li>
                                <a href="">
                                    <p className="bi bi-threads fs-5">&nbsp; Threads</p>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer