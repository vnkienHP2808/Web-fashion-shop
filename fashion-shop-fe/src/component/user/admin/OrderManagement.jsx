import React, { useEffect, useState } from "react";
import axios from "axios";
import Paginated from "../../ui/Pagination";

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [expandedOrders, setExpandedOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [ordersPerPage] = useState(5);
    const [selectedImages, setSelectedImages] = useState({}); // Thêm trạng thái để quản lý ảnh được chọn cho từng sản phẩm
    const imageBaseUrl = "http://localhost:8080/images/"; // Đường dẫn cơ bản cho hình ảnh sản phẩm

    // Thêm interceptor để gửi header Authorization
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
        axios.get(`http://localhost:8080/api/orders?page=${currentPage}&size=${ordersPerPage}`)
            .then((res) => {
                setOrders(res.data.content);
                setTotalPages(res.data.totalPages);
                setTotalElements(res.data.totalElements || 0);
            })
            .catch((err) => console.error("Lỗi khi lấy danh sách đơn hàng:", err));
    }, [currentPage]);

    const toggleOrderDetails = (id) => {
        setExpandedOrders((prev) =>
            prev.includes(id) ? prev.filter((oid) => oid !== id) : [...prev, id]
        );
    };

    const updateOrderStatus = (id, status) => {
        const updatedOrders = orders.map((order) =>
            order.idOrder === id ? { ...order, status } : order
        );
        setOrders(updatedOrders);

        axios
            .put(`http://localhost:8080/api/orders/${id}`, status, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(() => {
                console.log("Trạng thái đơn hàng đã được cập nhật!");
            })
            .catch((error) => {
                console.error("Lỗi khi cập nhật trạng thái:", error.response?.data || error.message);
            });
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Hàm để cập nhật ảnh được chọn cho một sản phẩm
    const handleImageSelect = (productId, imageLink) => {
        setSelectedImages((prev) => ({
            ...prev,
            [productId]: imageLink,
        }));
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
                Quản Lý Đơn Hàng: <i style={{ fontWeight: "normal" }}>{totalElements} đơn hàng</i>
            </h2>

            <ul style={{ listStyleType: "none", padding: "0" }}>
                {orders.map((order) => {
                    const statusValue =
                        typeof order.status === "object" ? order.status.status : order.status;

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
                                onClick={() => toggleOrderDetails(order.idOrder)}
                                style={{
                                    color: "#007bff",
                                    fontSize: "1.4em",
                                    marginBottom: "10px",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                }}
                            >
                                Order #{order.idOrder}
                            </h3>
                            <p style={{ fontSize: "0.9em", color: "#666", margin: "5px 0" }}>
                                <strong style={{ fontWeight: "bold", color: "#444" }}>
                                    Trạng thái:
                                </strong>{" "}
                                {statusValue}
                            </p>

                            {expandedOrders.includes(order.idOrder) && (
                                <div style={{ display: "flex", gap: "20px" }}>
                                    {/* Phần thông tin chi tiết bên trái */}
                                    <div style={{ flex: 1 }}>
                                        <p
                                            style={{
                                                fontSize: "0.9em",
                                                color: "#666",
                                                margin: "5px 0",
                                            }}
                                        >
                                            <strong style={{ fontWeight: "bold", color: "#444" }}>
                                                Số điện thoại:
                                            </strong>{" "}
                                            {order.phoneNumber}
                                        </p>
                                        <p
                                            style={{
                                                fontSize: "0.9em",
                                                color: "#666",
                                                margin: "5px 0",
                                            }}
                                        >
                                            <strong style={{ fontWeight: "bold", color: "#444" }}>
                                                Địa chỉ:
                                            </strong>{" "}
                                            {order.address}
                                        </p>
                                        <p
                                            style={{
                                                fontSize: "0.9em",
                                                color: "666",
                                                margin: "5px 0",
                                            }}
                                        >
                                            <strong style={{ fontWeight: "bold", color: "#444" }}>
                                                Ngày đặt hàng:
                                            </strong>{" "}
                                            {order.orderDate}
                                        </p>
                                        <p
                                            style={{
                                                fontSize: "0.9em",
                                                color: "#666",
                                                margin: "5px 0",
                                            }}
                                        >
                                            <strong style={{ fontWeight: "bold", color: "#444" }}>
                                                Phương thức thanh toán:
                                            </strong>{" "}
                                            {order.paymentMethod}
                                        </p>
                                        <p
                                            style={{
                                                fontSize: "0.9em",
                                                color: "#666",
                                                margin: "5px 0",
                                            }}
                                        >
                                            <strong style={{ fontWeight: "bold", color: "#444" }}>
                                                Tổng giá sản phẩm:
                                            </strong>{" "}
                                            {order.orderDetails.reduce(
                                                (sum, item) => sum + item.totalAmount,
                                                0
                                            )}{" "}
                                            VND
                                        </p>
                                        <p
                                            style={{
                                                fontSize: "0.9em",
                                                color: "#666",
                                                margin: "5px 0",
                                            }}
                                        >
                                            <strong style={{ fontWeight: "bold", color: "#444" }}>
                                                Phí vận chuyển:
                                            </strong>{" "}
                                            {order.shippingFee} VND
                                        </p>
                                        <p
                                            style={{
                                                fontSize: "0.9em",
                                                color: "#666",
                                                margin: "5px 0",
                                            }}
                                        >
                                            <strong style={{ fontWeight: "bold", color: "#444" }}>
                                                Tổng tiền đơn hàng:
                                            </strong>{" "}
                                            {order.grandTotal} VND
                                        </p>
                                    </div>

                                    {/* Phần hình ảnh sản phẩm bên phải */}
                                    <div style={{ flex: 1 }}>
                                        <h4
                                            style={{
                                                fontSize: "1.1em",
                                                color: "#444",
                                                margin: "10px 0",
                                            }}
                                        >
                                            Danh sách sản phẩm đặt hàng:
                                        </h4>
                                        {order.orderDetails.length > 0 ? (
                                            order.orderDetails.map((item) => (
                                                <div
                                                    key={item.product.idProduct}
                                                    style={{
                                                        margin: "15px 0",
                                                        padding: "15px",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "10px",
                                                        backgroundColor: "#fff",
                                                    }}
                                                >
                                                    <div style={{ textAlign: "center" }}>
                                                        <img
                                                            src={
                                                                selectedImages[item.product.idProduct] ||
                                                                `${imageBaseUrl}${item.product.images[0].imageLink}`
                                                            }
                                                            alt={item.product.name_product}
                                                            style={{
                                                                width: "200px",
                                                                height: "200px",
                                                                objectFit: "cover",
                                                                borderRadius: "10px",
                                                                marginBottom: "10px",
                                                            }}
                                                        />
                                                    </div>
                                                    <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "5px" }}>
                                                        {item.product.name_product}
                                                    </div>
                                                    <div style={{ textAlign: "center", marginBottom: "10px" }}>
                                                        Số lượng: {item.quantity} <br />
                                                        Giá:{" "}
                                                        {item.product.is_sale && item.product.sale_price != null ? (
                                                            <>
                                                                <span style={{ color: "red", fontWeight: "bold" }}>
                                                                    {item.product.sale_price.toLocaleString()}₫
                                                                </span>{" "}
                                                                <span
                                                                    style={{
                                                                        textDecoration: "line-through",
                                                                        color: "gray",
                                                                        marginLeft: "5px",
                                                                    }}
                                                                >
                                                                    {item.product.price.toLocaleString()}₫
                                                                </span>{" "}
                                                                <span
                                                                    style={{
                                                                        color: "#f39c12",
                                                                        fontWeight: "bold",
                                                                    }}
                                                                >
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
                                                    <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
                                                        {item.product.images.map((image, index) => (
                                                            <img
                                                                key={index}
                                                                src={`${imageBaseUrl}${image.imageLink}`}
                                                                alt="thumbnail"
                                                                onClick={() =>
                                                                    handleImageSelect(item.product.idProduct, `${imageBaseUrl}${image.imageLink}`)
                                                                }
                                                                style={{
                                                                    width: "50px",
                                                                    height: "50px",
                                                                    objectFit: "cover",
                                                                    border:
                                                                        selectedImages[item.product.idProduct] ===
                                                                        `${imageBaseUrl}${image.imageLink}`
                                                                            ? "2px solid #000"
                                                                            : "1px solid #ccc",
                                                                    borderRadius: "4px",
                                                                    cursor: "pointer",
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <span
                                                style={{
                                                    fontSize: "13px",
                                                    color: "red",
                                                }}
                                            >
                                                <i>Sản phẩm hiện không tồn tại</i>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                            <select
                                value={statusValue}
                                onChange={(e) =>
                                    updateOrderStatus(order.idOrder, e.target.value)
                                }
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

            <div
                className="d-flex justify-content-center"
                style={{ marginTop: "20px" }}
            >
                <Paginated
                    totalPages={totalPages}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default OrderManagement;