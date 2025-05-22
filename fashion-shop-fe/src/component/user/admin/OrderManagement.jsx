import React, { useEffect, useState } from "react";
import axios from "axios";
import Paginated from "../../ui/Pagination";
import OrderFilter from "../../ui/OrderFilter";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [ordersPerPage] = useState(5);
  const [selectedImages, setSelectedImages] = useState({});
  const [openFilter, setOpenFilter] = useState(false); 
  const [selectedGrandTotalRange, setSelectedGrandTotalRange] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null); 
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: "",
    endDate: "",
  }); 
  const imageBaseUrl = "http://localhost:8080/images/";

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
    const params = {
      page: currentPage,
      size: ordersPerPage,
      ...(selectedGrandTotalRange && { grandTotalRange: selectedGrandTotalRange }),
      ...(selectedStatus && { status: selectedStatus }),
      ...(selectedDateRange.startDate && { startDate: selectedDateRange.startDate }),
      ...(selectedDateRange.endDate && { endDate: selectedDateRange.endDate }),
    };

    axios
      .get(`http://localhost:8080/api/orders`, { params })
      .then((res) => {
        setOrders(Array.isArray(res.data.content) ? res.data.content : []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách đơn hàng:", err);
        setOrders([]);
      });
  }, [
    currentPage,
    selectedGrandTotalRange,
    selectedStatus,
    selectedDateRange,
  ]);

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

  const handleImageSelect = (productId, imageLink) => {
    setSelectedImages((prev) => ({
      ...prev,
      [productId]: imageLink,
    }));
  };

  const handleGrandTotalRangeChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedGrandTotalRange(value);
    } else {
      setSelectedGrandTotalRange(null);
    }
    setCurrentPage(1); 
  };

  const handleStatusChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedStatus(value);
    } else {
      setSelectedStatus(null);
    }
    setCurrentPage(1); 
  };

  const handleDateRangeChange = (event) => {
    const { name, value } = event.target;
    setSelectedDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); 
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

      <div
        className="d-flex align-items-center justify-content-end"
        style={{ marginBottom: "20px" }}
      >
        <OrderFilter
          selectedGrandTotalRange={selectedGrandTotalRange}
          handleGrandTotalRangeChange={handleGrandTotalRangeChange}
          selectedStatus={selectedStatus}
          handleStatusChange={handleStatusChange}
          selectedDateRange={selectedDateRange}
          handleDateRangeChange={handleDateRangeChange}
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
        />
      </div>

      <ul style={{ listStyleType: "none", padding: "0" }}>
        {Array.isArray(orders) && orders.length > 0 ? (
          orders.map((order) => {
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
                  {statusValue || "N/A"}
                </p>

                {expandedOrders.includes(order.idOrder) && (
                  <div style={{ display: "flex", gap: "20px" }}>
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
                        {order.phoneNumber || "N/A"}
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
                        {order.address || "N/A"}
                      </p>
                      <p
                        style={{
                          fontSize: "0.9em",
                          color: "#666",
                          margin: "5px 0",
                        }}
                      >
                        <strong style={{ fontWeight: "bold", color: "#444" }}>
                          Ngày đặt hàng:
                        </strong>{" "}
                        {order.orderDate || "N/A"}
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
                        {order.paymentMethod || "N/A"}
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
                        {Array.isArray(order.orderDetails)
                          ? order.orderDetails.reduce(
                              (sum, item) => sum + (item.totalAmount || 0),
                              0
                            )
                          : 0}{" "}
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
                        {order.shippingFee || 0} VND
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
                        {order.grandTotal || 0} VND
                      </p>
                    </div>

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
                      {Array.isArray(order.orderDetails) && order.orderDetails.length > 0 ? (
                        order.orderDetails.map((item) => (
                          <div
                            key={item.product?.idProduct || item.id}
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
                                  selectedImages[item.product?.idProduct] ||
                                  (item.product?.images?.[0]?.imageLink
                                    ? `${imageBaseUrl}${item.product.images[0].imageLink}`
                                    : "")
                                }
                                alt={item.product?.name_product || "Sản phẩm không tồn tại"}
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
                              {item.product?.name_product || "Sản phẩm không tồn tại"}
                            </div>
                            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                              Số lượng: {item.quantity || 0} <br />
                              Giá:{" "}
                              {item.product?.is_sale && item.product?.sale_price != null ? (
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
                                    {item.product.price && item.product.sale_price
                                      ? Math.floor(
                                          ((item.product.price - item.product.sale_price) /
                                            item.product.price) *
                                            100
                                        )
                                      : 0}
                                    %
                                  </span>
                                </>
                              ) : (
                                <span style={{ fontWeight: "bold" }}>
                                  {item.product?.price?.toLocaleString() || 0}₫
                                </span>
                              )}
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
                              {Array.isArray(item.product?.images) && item.product.images.length > 0 ? (
                                item.product.images.map((image, index) => (
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
                                        selectedImages[item.product?.idProduct] ===
                                        `${imageBaseUrl}${image.imageLink}`
                                          ? "2px solid #000"
                                          : "1px solid #ccc",
                                      borderRadius: "4px",
                                      cursor: "pointer",
                                    }}
                                  />
                                ))
                              ) : (
                                <span style={{ fontSize: "13px", color: "red" }}>
                                  <i>Không có hình ảnh</i>
                                </span>
                              )}
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
                  value={statusValue || ""}
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
          })
        ) : (
          <li style={{ textAlign: "center", color: "#666" }}>
            Không có đơn hàng nào
          </li>
        )}
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