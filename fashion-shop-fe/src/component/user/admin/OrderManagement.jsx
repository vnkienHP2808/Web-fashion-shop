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
  const [ordersPerPage] = useState(3);
  const [selectedImages, setSelectedImages] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedGrandTotalRange, setSelectedGrandTotalRange] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const imageBaseUrl = "http://localhost:8080/images/";

  const cssVars = {
    colors: {
      primary: "#2c3e50",
      secondary: "#34495e",
      accent: "#e74c3c",
      success: "#27ae60",
      muted: "#7f8c8d",
      lightGray: "#e0e0e0",
      background: "#f9f9f9",
      white: "#fff",
      border: "#ddd",
      highlight: "#007bff",
    },
    fontFamily: "'Roboto', sans-serif",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    spacing: {
      small: "10px",
      medium: "15px",
      large: "20px",
      xLarge: "30px",
    },
  };

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
  }, [currentPage, selectedGrandTotalRange, selectedStatus, selectedDateRange]);

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
    setExpandedOrders([]);
    setSelectedImages({});
  };

  const handleImageSelect = (orderId, productId, imageLink) => {
    setSelectedImages((prev) => ({
      ...prev,
      [orderId]: { productId, imageLink },
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
        padding: cssVars.spacing.xLarge,
        fontFamily: cssVars.fontFamily,
        backgroundColor: "#f8f9fa",
        borderRadius: cssVars.borderRadius,
        boxShadow: cssVars.boxShadow,
      }}
    >
      <h2
        style={{
          color: cssVars.colors.primary,
          fontSize: "1.8em",
          marginBottom: cssVars.spacing.large,
          textAlign: "center",
          fontWeight: "600",
        }}
      >
        Quản Lý Đơn Hàng: <span style={{ fontWeight: "normal", color: cssVars.colors.accent }}>{totalElements} đơn hàng</span>
      </h2>

      <div
        className="d-flex align-items-center justify-content-end"
        style={{ marginBottom: cssVars.spacing.large }}
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
                  backgroundColor: cssVars.colors.white,
                  border: `1px solid ${cssVars.colors.lightGray}`,
                  borderRadius: cssVars.borderRadius,
                  padding: cssVars.spacing.large,
                  marginBottom: cssVars.spacing.large,
                  boxShadow: cssVars.boxShadow,
                }}
              >
                <h3
                  onClick={() => toggleOrderDetails(order.idOrder)}
                  style={{
                    color: cssVars.colors.highlight,
                    fontSize: "1.4em",
                    marginBottom: cssVars.spacing.small,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Order #{order.idOrder}
                </h3>
                <p style={{ fontSize: "0.9em", color: cssVars.colors.muted, margin: "5px 0" }}>
                  <strong style={{ fontWeight: "bold", color: cssVars.colors.secondary }}>
                    Trạng thái:
                  </strong>{" "}
                  {statusValue || "N/A"}
                </p>

                {expandedOrders.includes(order.idOrder) && (
                  <div style={{ display: "flex", gap: cssVars.spacing.large, flexWrap: "wrap" }}>
                    {/* Cột trái - Thông tin đơn hàng và chi tiết sản phẩm */}
                    <div style={{ flex: 1, minWidth: "300px" }}>
                      <div
                        style={{
                          padding: cssVars.spacing.medium,
                          backgroundColor: cssVars.colors.background,
                          borderRadius: cssVars.borderRadius,
                        }}
                      >
                        <p style={{ fontSize: "0.9em", color: cssVars.colors.muted, margin: "5px 0" }}>
                          <strong style={{ fontWeight: "bold", color: cssVars.colors.secondary }}>
                            Số điện thoại:
                          </strong>{" "}
                          {order.phoneNumber || "N/A"}
                        </p>
                        <p style={{ fontSize: "0.9em", color: cssVars.colors.muted, margin: "5px 0" }}>
                          <strong style={{ fontWeight: "bold", color: cssVars.colors.secondary }}>
                            Địa chỉ:
                          </strong>{" "}
                          {order.address || "N/A"}
                        </p>
                        <p style={{ fontSize: "0.9em", color: cssVars.colors.muted, margin: "5px 0" }}>
                          <strong style={{ fontWeight: "bold", color: cssVars.colors.secondary }}>
                            Ngày đặt hàng:
                          </strong>{" "}
                          {order.orderDate || "N/A"}
                        </p>
                        <p style={{ fontSize: "0.9em", color: cssVars.colors.muted, margin: "5px 0" }}>
                          <strong style={{ fontWeight: "bold", color: cssVars.colors.secondary }}>
                            Phương thức thanh toán:
                          </strong>{" "}
                          {order.paymentMethod || "N/A"}
                        </p>
                        <p style={{ fontSize: "0.9em", color: cssVars.colors.muted, margin: "5px 0" }}>
                          <strong style={{ fontWeight: "bold", color: cssVars.colors.secondary }}>
                            Tổng giá sản phẩm:
                          </strong>{" "}
                          {Array.isArray(order.orderDetails)
                            ? order.orderDetails.reduce((sum, item) => sum + (item.totalAmount || 0), 0).toLocaleString()
                            : 0}{" "}
                          ₫
                        </p>
                        <p style={{ fontSize: "0.9em", color: cssVars.colors.muted, margin: "5px 0" }}>
                          <strong style={{ fontWeight: "bold", color: cssVars.colors.secondary }}>
                            Phí vận chuyển:
                          </strong>{" "}
                          {(order.shippingFee || 0).toLocaleString()} ₫
                        </p>
                        <p style={{ fontSize: "0.9em", color: cssVars.colors.muted, margin: "5px 0" }}>
                          <strong style={{ fontWeight: "bold", color: cssVars.colors.secondary }}>
                            Tổng tiền đơn hàng:
                          </strong>{" "}
                          {(order.grandTotal || 0).toLocaleString()} ₫
                        </p>
                      </div>

                      {/* Chi tiết sản phẩm */}
                      {Array.isArray(order.orderDetails) && order.orderDetails.map((item) => (
                        <div
                          key={item.idOrderDetail}
                          style={{
                            margin: `${cssVars.spacing.medium} 0`,
                            padding: cssVars.spacing.medium,
                            border: `1px solid ${cssVars.colors.border}`,
                            borderRadius: cssVars.borderRadius,
                            backgroundColor: cssVars.colors.white,
                          }}
                        >
                          {item.product ? (
                            <div style={{ display: "flex", alignItems: "center", gap: cssVars.spacing.small }}>
                              <img
                                src={`${imageBaseUrl}${item.product.images[0]?.imageLink}`}
                                alt={item.product.name_product}
                                onClick={() => handleImageSelect(order.idOrder, item.product.idProduct, `${imageBaseUrl}${item.product.images[0].imageLink}`)}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                  border: selectedImages[order.idOrder]?.imageLink === `${imageBaseUrl}${item.product.images[0].imageLink}`
                                    ? `2px solid ${cssVars.colors.highlight}`
                                    : `1px solid ${cssVars.colors.border}`,
                                  cursor: "pointer",
                                }}
                              />
                              <div>
                                <span style={{ fontSize: "0.9em", color: cssVars.colors.secondary }}>
                                  {item.product.name_product}
                                </span>
                                <span style={{ margin: "0 5px", color: cssVars.colors.muted }}> | </span>
                                <span style={{ fontSize: "0.9em", color: cssVars.colors.secondary }}>
                                  Số lượng: {item.quantity}
                                </span>
                                <div style={{ marginTop: "5px" }}>
                                  Giá:{" "}
                                  {item.product.is_sale && item.product.sale_price != null ? (
                                    <>
                                      <span style={{ color: cssVars.colors.accent, fontWeight: "bold" }}>
                                        {item.product.sale_price.toLocaleString()}₫
                                      </span>{" "}
                                      <span
                                        style={{ textDecoration: "line-through", color: "#95a5a6", marginLeft: "5px" }}
                                      >
                                        {item.product.price.toLocaleString()}₫
                                      </span>{" "}
                                      <span style={{ color: "#f39c12", fontWeight: "bold" }}>
                                        Sale: -
                                        {item.product.price && item.product.sale_price
                                          ? Math.floor(((item.product.price - item.product.sale_price) / item.product.price) * 100)
                                          : 0}
                                        %
                                      </span>
                                    </>
                                  ) : (
                                    <span style={{ fontWeight: "bold", color: cssVars.colors.secondary }}>
                                      {item.product.price.toLocaleString()}₫
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span style={{ color: cssVars.colors.accent, fontSize: "0.9em" }}>
                              Sản phẩm không tồn tại
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Cột phải - Ảnh lớn */}
                    <div style={{ flex: 1, minWidth: "280px", textAlign: "center" }}>
                      <h4 style={{ fontSize: "1.1em", color: cssVars.colors.secondary, margin: `${cssVars.spacing.medium} 0` }}>
                        Danh sách sản phẩm đặt hàng:
                      </h4>
                      {Array.isArray(order.orderDetails) && order.orderDetails.length > 0 ? (
                        (() => {
                          const selectedDetail = order.orderDetails.find(item =>
                            item.product && item.product.images.length > 0 &&
                            selectedImages[order.idOrder]?.imageLink === `${imageBaseUrl}${item.product.images[0].imageLink}`
                          );
                          const defaultDetail = order.orderDetails.find(item => item.product && item.product.images.length > 0);

                          const imageToShow = selectedImages[order.idOrder]?.imageLink || (defaultDetail && `${imageBaseUrl}${defaultDetail.product.images[0].imageLink}`);
                          const nameToShow = selectedDetail?.product?.name_product || defaultDetail?.product?.name_product;

                          return imageToShow ? (
                            <>
                              <img
                                src={imageToShow}
                                alt={nameToShow}
                                style={{
                                  width: "300px",
                                  height: "450px",
                                  objectFit: "cover",
                                  borderRadius: "10px",
                                  border: `1px solid ${cssVars.colors.border}`,
                                  marginBottom: cssVars.spacing.medium,
                                }}
                              />
                              <p style={{ fontWeight: "bold", color: cssVars.colors.secondary }}>{nameToShow}</p>
                            </>
                          ) : (
                            <p style={{ color: cssVars.colors.accent, fontStyle: "italic" }}>Không có ảnh hiển thị</p>
                          );
                        })()
                      ) : (
                        <p style={{ color: cssVars.colors.accent, fontStyle: "italic" }}>Sản phẩm hiện không tồn tại</p>
                      )}
                    </div>
                  </div>
                )}
                <select
                  value={statusValue || ""}
                  onChange={(e) => updateOrderStatus(order.idOrder, e.target.value)}
                  style={{
                    marginTop: cssVars.spacing.small,
                    padding: "8px",
                    borderRadius: "4px",
                    border: `1px solid ${cssVars.colors.border}`,
                    backgroundColor: "#f1f1f1",
                    width: "200px",
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
          <li style={{ textAlign: "center", color: cssVars.colors.muted, fontStyle: "italic" }}>
            Không có đơn hàng nào
          </li>
        )}
      </ul>

      <div
        className="d-flex justify-content-center"
        style={{ marginTop: cssVars.spacing.large }}
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