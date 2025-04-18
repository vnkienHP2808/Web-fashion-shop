import React, { useEffect, useState } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const account = JSON.parse(sessionStorage.getItem("account"));
    if (account) {
      setUserId(account.id_user);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8080/api/orders/user/${userId}`)
        .then((res) => setOrders(res.data))
        .catch((error) => console.error("Lỗi khi lấy đơn hàng:", error));
    }
  }, [userId]);

  return (
    <div style={{ display: "flex", padding: "20px", gap: "20px" }}>
      {/* Cột trái - Danh sách đơn */}
      <div style={{ flex: 1, maxWidth: "400px" }}>
        <h2>Đơn Hàng Của Tôi</h2>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.idOrder}
              onClick={() => setSelectedOrder(order)}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                cursor: "pointer",
                backgroundColor:
                  selectedOrder?.idOrder === order.idOrder ? "#f1f1f1" : "#fff",
              }}
            >
              <p>Ngày đặt: {order.orderDate}</p>
              <p>Tổng: {order.grandTotal}₫</p>
              <p>Trạng thái: {order.status}</p>
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                {order.orderDetails.length > 0 ? (
                  order.orderDetails.map((item) => (
                    <div key={item.idOrderDetail}>
                      {item.product ? (
                        <>
                          <img
                            src={item.product.images[0].imageLink}
                            alt={item.product.name_product}
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                          <span>{item.product.name_product}</span>
                          <span> &nbsp;|&nbsp;</span>
                          <span>Số lượng: {item.quantity}</span>
                        </>
                      ) : (
                        <span style={{ color: "red" }}>Sản phẩm không tồn tại</span>
                      )}
                    </div>
                  ))
                ) : (
                  <span style={{ color: "red" }}>Sản phẩm không tồn tại</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Bạn chưa có đơn hàng nào.</p>
        )}
      </div>

      {/* Cột phải - Chi tiết đơn hàng */}
      <div style={{ flex: 2, borderLeft: "1px solid #ccc", paddingLeft: "20px" }}>
        <h2>Chi Tiết Đơn Hàng</h2>
        {selectedOrder ? (
          <>
            <div>
              <p style={{ fontSize: "18px" }}>
                <strong>Ngày đặt:</strong> {selectedOrder.orderDate}
              </p>
              <p style={{ fontSize: "18px" }}>
                <strong>Địa chỉ giao hàng:</strong> {selectedOrder.address}
              </p>
              <p style={{ fontSize: "18px" }}>
                <strong>Số điện thoại nhận hàng:</strong> {selectedOrder.phoneNumber}
              </p>
              <p style={{ fontSize: "18px" }}>
                <strong>Cước giao hàng:</strong> {selectedOrder.shippingFee}₫
              </p>
              <p style={{ fontSize: "18px" }}>
                <strong>Tổng cộng:</strong> {selectedOrder.grandTotal}₫
              </p>
              <p style={{ fontSize: "18px" }}>
                <strong>Trạng thái:</strong> {selectedOrder.status}
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
              {selectedOrder.orderDetails.length > 0 ? (
                selectedOrder.orderDetails.map((item) => (
                  <div
                    key={item.idOrderDetail}
                    style={{
                      margin: "15px",
                      padding: "15px",
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      width: "220px",
                      backgroundColor: "#fff",
                    }}
                  >
                    {item.product ? (
                      <>
                        <div style={{ textAlign: "center" }}>
                          <img
                            src={selectedImage || item.product.images[0].imageLink}
                            alt={item.product.name_product}
                            style={{
                              width: "150px",
                              height: "150px",
                              objectFit: "cover",
                              borderRadius: "10px",
                              marginBottom: "10px",
                            }}
                          />
                        </div>

                        <div
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            marginBottom: "5px",
                          }}
                        >
                          {item.product.name_product}
                        </div>

                        <div style={{ textAlign: "center", marginBottom: "10px" }}>
                          Số lượng: {item.quantity} <br />
                          Giá:{" "}
                          {item.product.is_sale && item.product.sale_price != null ? (
                            <>
                              <span style={{ color: "red", fontWeight: "bold" }}>
                                {item.product.sale_price.toLocaleString()}₫
                              </span>
                              {" "}
                              <span
                                style={{
                                  textDecoration: "line-through",
                                  color: "gray",
                                  marginLeft: "5px",
                                }}
                              >
                                {item.product.price.toLocaleString()}₫
                              </span>
                              {" "}
                              <span style={{ color: "#f39c12", fontWeight: "bold" }}>
                                Sale: -
                                {Math.floor(
                                  ((item.product.price - item.product.sale_price) /
                                    item.product.price) *
                                    100
                                )}
                                %
                              </span>
                            </>
                          ) : (
                            <span style={{ fontWeight: "bold" }}>
                              {item.product.price?.toLocaleString()}₫
                            </span>
                          )}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "6px",
                          }}
                        >
                          {item.product.images.map((image, index) => (
                            <img
                              key={index}
                              src={image.imageLink}
                              alt="thumbnail"
                              onClick={() => setSelectedImage(image.imageLink)}
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                                border:
                                  selectedImage === image.imageLink
                                    ? "2px solid #000"
                                    : "1px solid #ccc",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          color: "red",
                          fontWeight: "bold",
                          padding: "20px",
                        }}
                      >
                        Sản phẩm không tồn tại
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    fontSize: "18px",
                    margin: "20px auto",
                  }}
                >
                  Sản phẩm không tồn tại trong đơn hàng này.
                </p>
              )}
            </div>
          </>
        ) : (
          <p style={{ fontSize: "22px", textAlign: "center" }}>
            <i>Vui lòng chọn một đơn hàng để xem chi tiết.</i>
          </p>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
