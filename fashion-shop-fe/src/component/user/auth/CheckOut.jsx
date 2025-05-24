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
  const [loggedInUser] = useState(() => JSON.parse(sessionStorage.getItem("account")));
  
  const imageBaseUrl = "http://localhost:8080/images/"; // Thêm base URL cho ảnh
  useEffect(() => {
    const auth = sessionStorage.getItem("auth");
    if (auth) {
      const interceptor = axios.interceptors.request.use((config) => {
        config.headers.Authorization = `Basic ${auth}`;
        return config;
      });
      return () => axios.interceptors.request.eject(interceptor);
    }
  }, []);

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
    if (loggedInUser) {
      axios.get(`http://localhost:8080/api/users/${loggedInUser.id_user}`)
        .then((res) => setUser(res.data))
        .catch((err) => console.error("Lỗi khi lấy thông tin người dùng:", err));
    }
  }, [loggedInUser]);

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
      await axios.post("http://localhost:8080/api/orders", order);

      const productUpdates = selectedProducts.map((item) => ({
        idProduct: item.product.idProduct,
        quantity: item.quantity,
      }));
      await axios.put("http://localhost:8080/api/products/update-quantity-and-sold", productUpdates);

      selectedProducts.forEach((item) => removeFromCart(item.product.idProduct));
      alert("Đơn hàng đã đặt thành công!");
      navigate("/myorder");
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
      console.error("Lỗi khi thêm địa chỉ:", error.response?.data);
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
      console.error("Lỗi khi thêm số điện thoại:", error.response?.data);
      alert("Có lỗi xảy ra khi thêm số điện thoại. Vui lòng thử lại!");
    }
  
    setNewPhoneNumber("");
  };

  return (
    <div>
      <Header />
      <Breadcrump prevtext="Giỏ hàng" text="Thanh toán" prevlink="/cart" />
      <div className="checkout-container" style={{ 
        maxWidth: "1200px", 
        margin: "0 auto", 
        padding: "30px 20px", 
        backgroundColor: "#fff", 
        borderRadius: "10px", 
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        fontFamily: "'Roboto', sans-serif"
      }}>
        <h2 style={{ 
          fontSize: "2em", 
          color: "#2c3e50", 
          textAlign: "center", 
          marginBottom: "30px",
          fontWeight: "600"
        }}>Đặt hàng</h2>
        <div className="checkout-items" style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
          gap: "20px", 
          marginBottom: "30px"
        }}>
          {selectedProducts.map((item) => (
            <div key={item.product.idProduct} className="checkout-item" style={{ 
              border: "1px solid #e0e0e0", 
              borderRadius: "8px", 
              padding: "15px", 
              backgroundColor: "#f9f9f9",
              display: "flex",
              alignItems: "center",
              gap: "15px",
              transition: "box-shadow 0.3s ease"
            }}>
              <div>
                <div >
                  <a href={`/products/${item.product.idProduct}`} className="product-name" style={{ 
                    fontSize: "1.2em", 
                    color: "#34495e", 
                    marginBottom: "10px" }}>Sản phẩm: {item.product.name_product}
                  </a>
                  <p style={{ margin: "5px 0", color: "#7f8c8d" }}>Số lượng: {item.quantity}</p>
                  <p style={{ margin: "5px 0", color: "#7f8c8d" }}>
                    Giá sản phẩm: 
                    {item.product.sale_price ? (
                      <>
                        <span style={{ color: "#e74c3c", fontWeight: "bold" }}>
                          {item.product.sale_price.toLocaleString()}₫
                        </span>
                        <span
                          style={{
                            color: "#95a5a6",
                            textDecoration: "line-through",
                            marginLeft: "10px"
                          }}
                        >
                          {item.product.price.toLocaleString()}₫
                        </span>
                      </>
                    ) : (
                      <span style={{ fontWeight: "bold", color: "#2c3e50" }}>
                        {item.product.price.toLocaleString()}₫
                      </span>
                    )}
                  </p>
                  <p style={{ 
                    margin: "5px 0", 
                    color: "#34495e", 
                    fontWeight: "500"
                  }}>
                    Tổng tiền:{" "}
                    {(item.product.sale_price || item.product.price) * item.quantity.toLocaleString()}₫
                  </p>
                </div>
              </div>
              <a href={`/products/${item.product.idProduct}`} className="product-name">
                <img
                  src={`${imageBaseUrl}${item.product.images[0]?.imageLink}`}
                  alt={item.product.name_product}
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid #ddd"
                  }}
                />
              </a>
            </div>
          ))}
        </div>

        <div className="summary" style={{ 
          border: "1px solid #e0e0e0", 
          borderRadius: "8px", 
          padding: "20px", 
          backgroundColor: "#f9f9f9",
          marginBottom: "30px"
        }}>
          <p style={{ fontSize: "1.1em", color: "#34495e", margin: "8px 0" }}>
            Tổng tiền hàng: {totalAmount.toLocaleString()}₫
          </p>
          <p style={{ fontSize: "1.1em", color: "#34495e", margin: "8px 0" }}>
            Phí vận chuyển: {shippingFee.toLocaleString()}₫ (Miễn phí với đơn hàng trên 699000đ)
          </p>
          <h3 style={{ 
            fontSize: "1.4em", 
            color: "#e74c3c", 
            margin: "15px 0", 
            fontWeight: "600",
            borderTop: "1px solid #e0e0e0",
            paddingTop: "15px"
          }}>Tổng thanh toán: {grandTotal.toLocaleString()}₫</h3>
        </div>

        <label style={{ 
          fontSize: "1.1em", 
          color: "#2c3e50", 
          marginBottom: "10px", 
          display: "block"
        }}>Số điện thoại người nhận:</label>
        <select
          value={selectedPhoneNumber}
          onChange={(e) => setSelectedPhoneNumber(e.target.value)}
          className="address-select"
          style={{ 
            width: "100%", 
            padding: "10px", 
            marginBottom: "15px", 
            border: "1px solid #ddd", 
            borderRadius: "6px",
            fontSize: "1em",
            color: "#34495e",
            backgroundColor: "#fff"
          }}
        >
          {user?.phones?.map((num, index) => (
            <option key={index} value={num}>
              {num}
            </option>
          ))}
        </select>

        <div className="add-address" style={{ 
          display: "flex", 
          gap: "10px", 
          marginBottom: "20px"
        }}>
          <input
            type="number"
            placeholder="Thêm số điện thoại mới (nhập đủ 10 số)"
            value={newPhoneNumber}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) {
                setNewPhoneNumber(value);
              }
            }}
            className="address-input"
            style={{ 
              flex: 1, 
              padding: "10px", 
              border: "1px solid #ddd", 
              borderRadius: "6px",
              fontSize: "1em",
              color: "#34495e"
            }}
          />
          <button
            onClick={handleAddNewPhoneNumber}
            className="add-address-btn"
            disabled={!/^\d{10}$/.test(newPhoneNumber)}
            style={{ 
              padding: "10px 20px", 
              border: "none", 
              borderRadius: "6px",
              backgroundColor: "#2ecc71",
              color: "#fff",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              opacity: !/^\d{10}$/.test(newPhoneNumber) ? 0.6 : 1
            }}
          >
            Thêm số điện thoại
          </button>
        </div>

        <label style={{ 
          fontSize: "1.1em", 
          color: "#2c3e50", 
          marginBottom: "10px", 
          display: "block"
        }}>Địa chỉ giao hàng:</label>
        <select
          value={selectedAddress}
          onChange={(e) => setSelectedAddress(e.target.value)}
          className="address-select"
          style={{ 
            width: "100%", 
            padding: "10px", 
            marginBottom: "15px", 
            border: "1px solid #ddd", 
            borderRadius: "6px",
            fontSize: "1em",
            color: "#34495e",
            backgroundColor: "#fff"
          }}
        >
          {user?.addresses?.map((addr, index) => (
            <option key={index} value={addr}>
              {addr}
            </option>
          ))}
        </select>

        <div className="add-address" style={{ 
          display: "flex", 
          gap: "10px", 
          marginBottom: "20px"
        }}>
          <input
            type="text"
            placeholder="Thêm địa chỉ mới"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            className="address-input"
            style={{ 
              flex: "1", 
              padding: "10px", 
              border: "1px solid #ddd", 
              borderRadius: "6px",
              fontSize: "1em",
              color: "#34495e"
            }}
          />
          <button onClick={handleAddNewAddress} className="add-address-btn" style={{ 
            padding: "10px 20px", 
            border: "none", 
            borderRadius: "6px",
            backgroundColor: "#3498db",
            color: "#fff",
            cursor: "pointer",
            transition: "background-color 0.3s ease"
          }}>
            Thêm địa chỉ
          </button>
        </div>

        <label style={{ 
          fontSize: "1.1em", 
          color: "#2c3e50", 
          marginBottom: "10px", 
          display: "block"
        }}>Chọn phương thức thanh toán:</label>
        <div className="payment-methods" style={{ 
          marginBottom: "20px", 
          padding: "15px", 
          border: "1px solid #e0e0e0", 
          borderRadius: "8px",
          backgroundColor: "#f9f9f9"
        }}>
          <label style={{ 
            display: "block", 
            marginBottom: "10px", 
            fontSize: "1em", 
            color: "#34495e"
          }}>
            <input
              type="radio"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
              style={{ marginRight: "10px" }}
            />
            Thanh toán khi nhận hàng (COD)
          </label>
          <label style={{ 
            display: "block", 
            marginBottom: "10px", 
            fontSize: "1em", 
            color: "#34495e"
          }}>
            <input
              type="radio"
              value="VNPay"
              checked={paymentMethod === "VNPay"}
              onChange={() => setPaymentMethod("VNPay")}
              style={{ marginRight: "10px" }}
            />
            VNPay
          </label>
          {paymentMethod === "VNPay" && (
            <span
              style={{
                display: "block",
                width: "200px",
                height: "200px",
                margin: "15px auto 0",
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
              }}
            >
              <img
                src="/assets/user/image/VNPay.jpeg"
                alt="QR VNPay"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </span>
          )}
        </div>

        <button onClick={handleCheckout} className="checkout-btn" style={{ 
          width: "100%", 
          padding: "12px", 
          border: "none", 
          borderRadius: "6px",
          backgroundColor: "#e74c3c",
          color: "#fff",
          fontSize: "1.2em",
          fontWeight: "500",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
          boxShadow: "0 2px 8px rgba(231, 76, 60, 0.3)"
        }}>
          Hoàn tất đơn hàng
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;