import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/orders").then((res) => {
            setOrders(res.data);
        });
    }, []);

    const updateOrderStatus = (id, status) => {
        const updatedOrders = orders.map((order) =>
            order.idOrder === id ? { ...order, status } : order
        );
        setOrders(updatedOrders);

        axios.put(
            `http://localhost:8080/api/orders/${id}`,
            JSON.stringify(status),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
            .then(() => {
                console.log("Trạng thái đơn hàng đã được cập nhật!");
            })
            .catch((error) => {
                console.error("Lỗi khi cập nhật trạng thái:", error);
            });
    };

    return (
        <div
            className="container"
            style={{
                margin: "auto",
                padding: "20px",
                fontFamily: "Arial, sans-serif",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
        >
            <h2
                style={{
                    color: "#333",
                    fontSize: "1.8em",
                    marginBottom: "20px",
                    textAlign: "center",
                    fontWeight: "600",
                }}
            >
                Order Management
            </h2>
            <ul style={{ listStyleType: "none", padding: "0" }}>
                {orders.map((order) => {
                    const statusValue = typeof order.status === "object" ? order.status.status : order.status;

                    return (
                        <li
                            key={order.idOrder}
                            style={{
                                backgroundColor: "#fff",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "20px",
                                marginBottom: "20px",
                            }}
                        >
                            <h3
                                style={{ color: "#555", fontSize: "1.4em", marginBottom: "10px" }}
                            >
                                Order #{order.idOrder}
                            </h3>
                            <p style={{ fontSize: "0.9em", color: "#666", margin: "5px 0" }}>
                                <strong style={{ fontWeight: "bold", color: "#444" }}>
                                    Trạng thái:
                                </strong>{" "}
                                {statusValue}
                            </p>
                            <p style={{ fontSize: "0.9em", color: "#666", margin: "5px 0" }}>
                                <strong style={{ fontWeight: "bold", color: "#444" }}>
                                    Số điện thoại:
                                </strong>{" "}
                                {order.phoneNumber}
                            </p>
                            <p style={{ fontSize: "0.9em", color: "#666", margin: "5px 0" }}>
                                <strong style={{ fontWeight: "bold", color: "#444" }}>
                                    Địa chỉ:
                                </strong>{" "}
                                {order.address}
                            </p>
                            <p style={{ fontSize: "0.9em", color: "#666", margin: "5px 0" }}>
                                <strong style={{ fontWeight: "bold", color: "#444" }}>
                                    Ngày đặt hàng:
                                </strong>{" "}
                                {order.orderDate}
                            </p>
                            <p style={{ fontSize: "0.9em", color: "#666", margin: "5px 0" }}>
                                <strong style={{ fontWeight: "bold", color: "#444" }}>
                                    Phương thức thanh toán:
                                </strong>{" "}
                                {order.paymentMethod}
                            </p>
                            <p style={{ fontSize: "0.9em", color: "#666", margin: "5px 0" }}>
                                <strong style={{ fontWeight: "bold", color: "#444" }}>
                                    Tổng giá sản phẩm:
                                </strong>{" "}
                                {
                                    order.orderDetails.reduce((sum, item) => sum + item.totalAmount, 0)
                                } VND
                            </p>
                            <p style={{ fontSize: "0.9em", color: "#666", margin: "5px 0" }}>
                                <strong style={{ fontWeight: "bold", color: "#444" }}>
                                    Phí vận chuyển:
                                </strong>{" "}
                                {order.shippingFee} VND
                            </p>
                            <p style={{ fontSize: "0.9em", color: "#666", margin: "5px 0" }}>
                                <strong style={{ fontWeight: "bold", color: "#444" }}>
                                    Tổng tiền đơn hàng:
                                </strong>{" "}
                                {order.grandTotal} VND
                            </p>
                            <h4 style={{ fontSize: "1.1em", color: "#444", margin: "10px 0" }}>
                                Sản phẩm đặt hàng:
                            </h4>
                            <div style={{ display: "flex", flexWrap: "wrap" }}>
                                {order.orderDetails.map((item) => (
                                    <div
                                        key={item.product.idProduct}
                                        style={{
                                            margin: "0 10px",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <img
                                            src={item.product.images[0].imageLink}
                                            alt={item.product.name_product}
                                            width="50"
                                            style={{ marginRight: "8px", borderRadius: "4px" }}
                                        />
                                        <div style={{ margin: 0 }}>
                                            {item.product.name_product} (x{item.quantity})
                                            <br />
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
                                                </>
                                            ) : (
                                                <span style={{ fontWeight: "bold" }}>
                                                    {item.product.price?.toLocaleString()}₫
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <select
                                value={statusValue}
                                onChange={(e) => updateOrderStatus(order.idOrder, e.target.value)}
                                style={{
                                    marginTop: "10px",
                                    padding: "8px",
                                    borderRadius: "4px",
                                    border: "1px solid #ddd",
                                    backgroundColor: "#f1f1f1",
                                }}
                            >
                                <option value="Chờ thanh toán">Chờ thanh toán</option>
                                <option value="Chờ nhận hàng">Chờ nhận hàng</option>
                                <option value="Đang giao hàng">Đang giao hàng</option>
                                <option value="Đã giao hàng">Đã giao hàng</option>
                                <option value="Hoàn thành">Hoàn thành</option>
                                <option value="Yêu cầu hoàn trả">Yêu cầu hoàn trả</option>
                            </select>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default OrderManagement;
