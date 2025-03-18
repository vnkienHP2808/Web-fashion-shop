import MyOrders from "../component/user/auth/MyOrder"
import Header from "../component/layout/Header"
import Footer from "../component/layout/Footer"

const MyOrderPage = () =>{
    return(
        <div>
            <Header></Header>
            <MyOrders></MyOrders>
            <Footer></Footer>
        </div>
    )
}

export default MyOrderPage