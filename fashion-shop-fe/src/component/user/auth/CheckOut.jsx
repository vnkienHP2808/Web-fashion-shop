import Footer from "../../layout/Footer";
import Header from "../../layout/Header";
import { CartContext } from "../../../context/CartContext";
import Breadcrump from "../../ui/Breadcrump";
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../style/checkout.css";
import axios from "axios";

const Checkout = () => {
  const { clearCart, removeFromCart } = useContext(CartContext);
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const navigate = useNavigate();
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const location = useLocation();
  const selectedProducts = location.state?.selectedCartItems || [];
  const loggedInUser = JSON.parse(sessionStorage.getItem("account"));

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/sign-in");
    } else if (loggedInUser.role !== "Customer") {
      navigate("/404");
    } else {
      setUser(loggedInUser);
      setSelectedAddress(loggedInUser.addresses[0] || "");
      setSelectedPhoneNumber(loggedInUser.phones[0] || "");
    }
  }, [navigate]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/users/${loggedInUser.id_user}`).then((res) => {
      setUser(res.data);
    });
  }, []);

  const totalAmount = selectedProducts.reduce(
    (acc, item) =>
      acc + (item.product.sale_price || item.product.price) * item.quantity,
    0
  );
  const shippingFee = totalAmount < 700000 ? 30000 : 0;
  const grandTotal = totalAmount + shippingFee;

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
      id_user: loggedInUser.id_user,
      status: "Đang chờ",
      address: selectedAddress,
      phoneNumber: selectedPhoneNumber,
      paymentMethod: paymentMethod,
      shippingFee: shippingFee,
      grandTotal: grandTotal,
      orderDetails: selectedProducts.map((item) => ({
        product: {
          idProduct: item.product.idProduct,
        },
        quantity: item.quantity,
        totalAmount: (item.product.sale_price || item.product.price) * item.quantity,
      })),
    };

    try {
      await axios.post("http://localhost:8080/api/orders", order, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      selectedProducts.forEach((item) => removeFromCart(item.product.idProduct));
      alert("Đơn hàng đã đặt thành công!");
      navigate("/");
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error.response?.data || error.message);
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    }
  };

  const handleAddNewAddress = async () => {
    if (newAddress.trim() === "") {
      alert("Vui lòng nhập địa chỉ mới!");
      return;
    }
  
    const updatedAddresses = [...(user.addresses || []), newAddress];
    setUser((prev) => ({ ...prev, addresses: updatedAddresses }));
    setSelectedAddress(newAddress);
  
    try {
      await axios.put(`http://localhost:8080/api/users/${loggedInUser.id_user}/addresses`, {
        addresses: updatedAddresses,
      });
      alert("Địa chỉ đã được thêm thành công!");
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
  
    const updatedPhones = [...(user.phones || []), newPhoneNumber];
    setUser((prev) => ({ ...prev, phones: updatedPhones }));
    setSelectedPhoneNumber(newPhoneNumber);
  
    try {
      await axios.put(`http://localhost:8080/api/users/${loggedInUser.id_user}/phones`, {
        phones: updatedPhones,
      });
      alert("Số điện thoại đã được thêm thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm số điện thoại:", error);
      alert("Có lỗi xảy ra khi thêm số điện thoại. Vui lòng thử lại!");
    }
  
    setNewPhoneNumber("");
  };
  

  return (
    <div>
      <Header />
      <Breadcrump prevtext="Giỏ hàng" text="Thanh toán" prevlink="/cart" />
      <div className="checkout-container">
        <h2>Đặt hàng</h2>
        <div className="checkout-items">
          {selectedProducts.map((item) => (
            <div key={item.product.idProduct} className="checkout-item">
              <h4>Sản phẩm: {item.product.name_product}</h4>
              <p>Số lượng: {item.quantity}</p>
              <p>Giá sản phẩm:&nbsp;
                {item.product.sale_price ? (
                  <>
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      {item.product.sale_price}₫
                    </span>
                    <span
                      style={{
                        color: "gray",
                        textDecoration: "line-through",
                        marginLeft: "10px",
                      }}
                    >
                      {item.product.price}₫
                    </span>
                  </>
                ) : (
                  <span>{item.product.price}₫</span>
                )}
              </p>
              <p>
                Tổng tiền:{" "}
                {(item.product.sale_price || item.product.price) * item.quantity}₫
              </p>
            </div>
          ))}
        </div>

        <div className="summary">
          <p style={{ fontSize: "15px" }}>Tổng tiền hàng: {totalAmount.toLocaleString()}₫</p>
          <p style={{ fontSize: "15px" }}>
            Phí vận chuyển: {shippingFee.toLocaleString()}₫ (Miễn phí với đơn hàng trên 699000đ)
          </p>
          <h3 style={{ border: "none" }}>Tổng thanh toán: {grandTotal.toLocaleString()}₫</h3>
        </div>

        <label>Số điện thoại người nhận:</label>
        <select
          value={selectedPhoneNumber}
          onChange={(e) => setSelectedPhoneNumber(e.target.value)}
          className="address-select"
        >
          {user?.phones?.map((num, index) => (
            <option key={index} value={num}>
              {num}
            </option>
          ))}
        </select>

        <div className="add-address">
          <input
            type="number"
            placeholder="Thêm số điện thoại mới (nhập đủ 10 số)"
            value={newPhoneNumber}
            onChange={(e) => {
              const value = e.target.value;
              // Chỉ cho nhập số và tối đa 10 chữ số
              if (/^\d{0,10}$/.test(value)) {
                setNewPhoneNumber(value);
              }
            }}
            className="address-input"
          />
          <button
            onClick={handleAddNewPhoneNumber}
            className="add-address-btn"
            disabled={!/^\d{10}$/.test(newPhoneNumber)} // disable nếu không đủ 10 số
          >
            Thêm số điện thoại
          </button>
        </div>


        <label>Địa chỉ giao hàng:</label>
        <select
          value={selectedAddress}
          onChange={(e) => setSelectedAddress(e.target.value)}
          className="address-select"
        >
          {user?.addresses?.map((addr, index) => (
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
                border: "1px solid",
              }}
            >
              <img
                src="/assets/user/image/VNPay.jpeg"
                alt="QR VNPay"
                style={{ width: "100%", height: "100%" }}
              />
            </span>
          )}
        </div>

        <button onClick={handleCheckout} className="checkout-btn">
          Hoàn tất đơn hàng
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
