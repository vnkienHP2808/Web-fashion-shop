import Footer from "../../layout/Footer"
import Header from "../../layout/Header"
import { CartContext } from "../../../context/CartContext";
import Breadcrump from "../../ui/Breadcrump"
import React, { useContext, useState, useEffect, use } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../style/checkout.css"
const Checkout = () =>{
    const { clearCart, removeFromCart } = useContext(CartContext); // phương thức từ cartcontext đê xử lý giỏ hàng khi thanh toán => xóa sp thanh toán khỏi giỏ
    const [user, setUser] = useState(null); // lấy thông tin người dùng đnag login để sau này làm thông tin giao hàng
    const [paymentMethod, setPaymentMethod] = useState("COD"); // mặc định phương thức thanh toán là cod, có thể đổi
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [userAddress, setUserAddress] = useState("");
    // lấy dữ liệu từ trang trước để thao tác
    const location = useLocation();
    const selectedProducts = location.state?.selectedCartItems || [];
    const loggedInUser = JSON.parse(sessionStorage.getItem("account"));


    useEffect(() => { //ktra quyền mua hàng
        if (!loggedInUser) { // chưa đăng nhập => bắt đăng nhập
          navigate("/sign-in");
        } else {
          if (loggedInUser.role !== "customer") { // admin 0 mua, chỉ khách mới mua
            navigate("/404");
          } else { // hợp lệ => lưu thông tin, địa chỉ
            setUser(loggedInUser);
          }
        }
    }, [navigate]);

    useEffect(() => {
        fetch("/db.json")
            .then((response) => response.json())
            .then((data) => {
                const foundUser = data.users.find((p) => p.id.toString() === loggedInUser.id);
                if (foundUser) {
                    setUser(foundUser);
                    console.log(loggedInUser.id);
                }
            })
            .catch((error) => console.error("Error loading data:", error));
    }, []);

    // tính tổng đơn hàng <do có vận chuyển>
    const totalAmount = selectedProducts.reduce(
        (acc, item) => acc + (item.salePrice || item.price) * item.quantity,
        0
    );
    const shippingFee = totalAmount < 700000 ? 30000 : 0; // dưới 700k => vc=30k
    const grandTotal = totalAmount + shippingFee; // tổng

    const handleCheckout = async () => {
        const order = {
          id: Date.now(),
          customerId: loggedInUser.id,
          items: selectedProducts,
          address: userAddress,
          phone: phoneNumber,
          date: new Date().toLocaleDateString(),
          paymentMethod: paymentMethod,
          status: "Đang chờ",
          totalAmount,
          shippingFee,
          grandTotal,
        };
    
        console.log("Đơn hàng đã tạo:", order);
    
        try {
        //   await axios.post("http://localhost:9999/orders", order);
          selectedProducts.forEach((product) => removeFromCart(product.id));
    
          alert("Đơn hàng đã đặt thành công!");
          navigate("/");
        } catch (error) {
          console.error("Lỗi khi đặt hàng:", error);
          alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
        }
      };

    return(
        <div>
            <Header></Header>
            <Breadcrump
                prevtext={"Giỏ hàng"}
                text={"Thanh toán"}
                prevlink={"/cart"}
            ></Breadcrump>
            <div className="checkout-container">
                <h2>Đặt hàng</h2>
                <div className="checkout-items">
                    {selectedProducts.map((product) => (
                        <div key={product.id} className="checkout-item">
                            <h4>{product.name}</h4>
                            <p>Số lượng: {product.quantity}</p>
                            <p>
                                {product.salePrice ? (
                                    <>
                                        <span style={{ color: "red", fontWeight: "bold" }}>
                                            {product.salePrice}₫
                                        </span>
                                        <span
                                            style={{
                                                color: "gray",
                                                textDecoration: "line-through",
                                                marginLeft: "10px",
                                            }}
                                        >
                                            {product.price}₫
                                        </span>
                                    </>
                                ) : (
                                    <span>{product.price}₫</span>
                                )}
                            </p>
                            <p>
                                Tổng tiền:{" "}
                                {(product.salePrice || product.price) * product.quantity}₫
                            </p>
                        </div>
                    ))}
                </div>

                <div className="summary">
                    <p style={{fontSize: "15px"}}>Tổng tiền hàng: {totalAmount.toLocaleString()}₫</p>
                    <p style={{fontSize: "15px"}}>
                        Phí vận chuyển: {shippingFee.toLocaleString()}₫ (Miễn phí với đơn
                        hàng trên 699000đ)
                    </p>
                    <h3 style={{border: "none"}}>Tổng thanh toán: {grandTotal.toLocaleString()}₫</h3>
                </div>

                <label>Số điện thoại người nhận:</label>
                <div className="add-address">
                    <input
                        type="text"
                        placeholder="Nhập số điện thoại"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="address-input"
                        required
                    />
                </div>

                <label>Địa chỉ giao hàng:</label>
                <div className="add-address">
                    <input
                        type="text"
                        placeholder="Nhập địa chỉ nhận hàng"
                        value={userAddress}
                        onChange={(e) => setUserAddress(e.target.value)}
                        className="address-input"
                        required
                    />
                </div>

                <label>Chọn phương thức thanh toán:</label>
                <div className="payment-methods">
                    <label>
                        <input
                            type="radio"
                            value="COD"
                            checked={paymentMethod === "COD"}
                            onChange={() => setPaymentMethod("COD")}
                        />
                        Thanh toán khi nhận hàng (COD)
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="VNPay"
                            checked={paymentMethod === "VNPay"}
                            onChange={() => setPaymentMethod("VNPay")}
                        />
                        VNPay
                    </label>
                </div>

                <button onClick={handleCheckout} className="checkout-btn">
                    Hoàn tất đơn hàng
                </button>
            </div>
            <Footer></Footer>
        </div>
    )
}

export default Checkout