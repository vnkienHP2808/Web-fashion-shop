import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const loggedInUser = JSON.parse(sessionStorage.getItem("account"));

  useEffect(() => {
    if (loggedInUser) {
      axios
        .get(`http://localhost:9999/orders?customerId=${loggedInUser.id}`)
        .then((res) => setOrders(res.data))
        .catch((error) => console.error("Lỗi khi lấy đơn hàng:", error));
    }
  }, [loggedInUser]);

  return (
    <div style={{ margin: "20px" }}>
      <h2>Đơn Hàng Của Tôi</h2>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "5px",
            }}
          >
            <p>Ngày đặt hàng: {order.date}</p>
            <p>Tổng cộng: {order.grandTotal}₫</p>
            <p>Trạng thái: {order.status}</p>
            {/* {order.status === "pendingpayment" && (
              <Link
                to="/payment"
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  borderRadius: "5px",
                  textDecoration: "none",
                  marginTop: "10px",
                }}
              >
                Thanh Toán
              </Link>
            )} */}
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    margin: "10px",
                    textAlign: "center",
                    flex: "1 1 100px",
                  }}
                >
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  />
                  <span>{item.name}</span>
                  <span> &nbsp;|&nbsp;</span>
                  <span>Số lượng: {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>Bạn chưa có đơn hàng nào.</p>
      )}
    </div>
  );
};

export default MyOrders;
