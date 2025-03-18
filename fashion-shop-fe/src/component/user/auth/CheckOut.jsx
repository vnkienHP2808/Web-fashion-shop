import Footer from "../../layout/Footer"
import Header from "../../layout/Header"
import { CartContext } from "../../../context/CartContext";
import Breadcrump from "../../ui/Breadcrump"
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../style/checkout.css"
import axios from "axios";

const Checkout = () => {
    const { clearCart, removeFromCart } = useContext(CartContext); // phương thức từ cartcontext đê xử lý giỏ hàng khi thanh toán => xóa sp thanh toán khỏi giỏ
    const [user, setUser] = useState(null); // lấy thông tin người dùng đnag login để sau này làm thông tin giao hàng
    const [paymentMethod, setPaymentMethod] = useState("COD"); // mặc định phương thức thanh toán là cod, có thể đổi
    const navigate = useNavigate();
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [newAddress, setNewAddress] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");
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
                setSelectedAddress(loggedInUser.address[0] || "");
                setSelectedPhoneNumber(loggedInUser.phonenumber[0] || "");
            }
        }
    }, [navigate]);

    // lấy làm đơn cho id người mua
    useEffect(() => {
        axios.get(`http://localhost:9999/users/${loggedInUser.id}`).then((res) => {
            setUser(res.data);
            console.log(loggedInUser.id);
        });
    }, []);

    // tính tổng đơn hàng <do có vận chuyển>
    const totalAmount = selectedProducts.reduce(
        (acc, item) => acc + (item.salePrice || item.price) * item.quantity,
        0
    );
    const shippingFee = totalAmount < 700000 ? 30000 : 0; // dưới 700k => vc=30k
    const grandTotal = totalAmount + shippingFee; // tổng

    const handleCheckout = async () => {
        if (!selectedAddress) {
            alert("Vui lòng chọn địa chỉ giao hàng!");
            return;
        }

        if (!selectedPhoneNumber) {
            alert("Vui lòng chọn số điện thoại nhận hàng!");
            return;
        }
        const order = {
            id: Date.now(),
            customerId: loggedInUser.id,
            customerName: loggedInUser.username,
            items: selectedProducts,
            address: selectedAddress,
            phonenumber: selectedPhoneNumber,
            date: new Date().toLocaleDateString(),
            paymentMethod: paymentMethod,
            status: "Đang chờ",
            totalAmount,
            shippingFee,
            grandTotal,
        };

        console.log("Đơn hàng đã tạo:", order);

        try {
            await axios.post("http://localhost:9999/orders", order);
            selectedProducts.forEach((product) => removeFromCart(product.id));

            alert("Đơn hàng đã đặt thành công!");
            navigate("/");
        } catch (error) {
            console.error("Lỗi khi đặt hàng:", error);
            alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
        }
    };

    const handleAddNewAddress = async () => {
        if (newAddress.trim() === "") {
            alert("Vui lòng nhập địa chỉ mới!");
            return;
        }

        const updatedUser = { ...user, address: [...user.address, newAddress] };
        setUser(updatedUser);
        setSelectedAddress(newAddress);

        try {
            await axios.put(
                "http://localhost:9999/users/" + loggedInUser.id,
                updatedUser
            );
            alert("Địa chỉ đã được thêm thành công!");
            setUser(updatedUser);
        } catch (error) {
            console.error("Lỗi khi thêm địa chỉ:", error);
            alert("Có lỗi xảy ra khi thêm địa chỉ. Vui lòng thử lại!");
        }

        setNewAddress("");
    };

    const handleAddNewPhoneNumber = async () => {
        if (newPhoneNumber.trim() === "") {
            alert("Vui lòng nhập số điện thoại mới!");
            return;
        }

        const updatedUser = { ...user, phonenumber: [...user.phonenumber, newPhoneNumber] };
        setUser(updatedUser);
        setSelectedPhoneNumber(newPhoneNumber);

        try {
            await axios.put(
                "http://localhost:9999/users/" + loggedInUser.id,
                updatedUser
            );
            alert("Số điện thoại đã được thêm thành công!");
            setUser(updatedUser);
        } catch (error) {
            console.error("Lỗi khi số điện thoại:", error);
            alert("Có lỗi xảy ra khi thêm số điện thoại. Vui lòng thử lại!");
        }

        setNewPhoneNumber("");
    };

    return (
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
                    <p style={{ fontSize: "15px" }}>Tổng tiền hàng: {totalAmount.toLocaleString()}₫</p>
                    <p style={{ fontSize: "15px" }}>
                        Phí vận chuyển: {shippingFee.toLocaleString()}₫ (Miễn phí với đơn
                        hàng trên 699000đ)
                    </p>
                    <h3 style={{ border: "none" }}>Tổng thanh toán: {grandTotal.toLocaleString()}₫</h3>
                </div>

                <label>Số điện thoại người nhận:</label>
                <select
                    value={selectedPhoneNumber}
                    onChange={(e) => setSelectedPhoneNumber(e.target.value)}
                    className="address-select"
                >
                    {user?.phonenumber?.map((num, index) => (
                        <option key={index} value={num}>
                            {num}
                        </option>
                    ))}
                </select>

                <div className="add-address">
                    <input
                        type="text"
                        placeholder="Thêm số điện thoại mới"
                        value={newPhoneNumber}
                        onChange={(e) => setNewPhoneNumber(e.target.value)}
                        className="address-input"
                    />
                    <button onClick={handleAddNewPhoneNumber} className="add-address-btn">
                        Thêm số điện thoại
                    </button>
                </div>

                <label>Địa chỉ giao hàng:</label>
                <select
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    className="address-select"
                >
                    {user?.address?.map((addr, index) => (
                        <option key={index} value={addr}>
                            {addr}
                        </option>
                    ))}
                </select>

                <div className="add-address">
                    <input
                        type="text"
                        placeholder="Thêm địa chỉ mới"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        className="address-input"
                    />
                    <button onClick={handleAddNewAddress} className="add-address-btn">
                        Thêm địa chỉ
                    </button>
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
                    {paymentMethod === "VNPay" && (
                        <span
                            style={{
                                display: "flex",
                                width: "200px",
                                height: "200px",
                                marginLeft: "70px",
                                marginTop: "15px",
                                border: "1px solid"
                            }}
                        >
                            <img src="/assets/user/image/VNPay.jpeg" alt="QR VNPay" style={{ width: "100%", height: "100%" }} />
                        </span>
                    )}
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