import React, { useEffect, useState } from "react";
import axios from "axios";
import Paginated from "../../ui/Pagination";
import OrderFilter from "../../ui/OrderFilter";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [ordersPerPage] = useState(3);

  const [openFilter, setOpenFilter] = useState(false);
  const [selectedGrandTotalRange, setSelectedGrandTotalRange] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const imageBaseUrl = "http://localhost:8080/images/";

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
    const account = JSON.parse(sessionStorage.getItem("account"));
    if (account) {
      setUserId(account.id_user);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const params = {
        page: currentPage,
        size: ordersPerPage,
        ...(selectedGrandTotalRange && { grandTotalRange: selectedGrandTotalRange }),
        ...(selectedStatus && { status: selectedStatus }),
        ...(selectedDateRange.startDate && { startDate: selectedDateRange.startDate }),
        ...(selectedDateRange.endDate && { endDate: selectedDateRange.endDate }),
      };
      axios
        .get(`http://localhost:8080/api/orders/user/${userId}`, { params })
        .then((res) => {
          setOrders(Array.isArray(res.data.content) ? res.data.content : []);
          setTotalPages(res.data.totalPages);
          setTotalElements(res.data.totalElements || 0);
        })
        .catch((error) => console.error("Lỗi khi lấy đơn hàng:", error));
    }
  }, [userId, currentPage, selectedGrandTotalRange, selectedStatus, selectedDateRange]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedOrder(null);
    setSelectedImage(null);
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
    <div className="my-orders-container" style={{
      padding: "30px",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
      fontFamily: "'Roboto', sans-serif"
    }}>
      <div className="orders-wrapper" style={{
        display: "flex",
        gap: "30px",
        flexWrap: "wrap"
      }}>
        {/* Cột trái - Danh sách đơn hàng */}
        <div className="orders-list" style={{
          flex: 1,
          minWidth: "350px",
          maxWidth: "450px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "20px"
        }}>
          <h2 style={{
            fontSize: "1.8em",
            color: "#2c3e50",
            marginBottom: "20px",
            fontWeight: "600",
            textAlign: "center"
          }}>
            Đơn Hàng Của Tôi: <span style={{ color: "#e74c3c" }}>{totalElements}</span>
          </h2>
          <div
            className="filter-section"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "20px"
            }}
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
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.idOrder}
                onClick={() => {
                  setSelectedOrder(order);
                  setSelectedImage(null);
                }}
                className="order-item"
                style={{
                  border: "1px solid #e0e0e0",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedOrder?.idOrder === order.idOrder ? "#e8f4ff" : "#fff",
                  transition: "background-color 0.3s ease",
                  boxShadow: selectedOrder?.idOrder === order.idOrder
                    ? "0 0 8px rgba(0, 123, 255, 0.2)"
                    : "none"
                }}
              >
                <p style={{ margin: "5px 0", color: "#34495e", fontSize: "1em" }}>
                  <strong>Ngày đặt:</strong> {order.orderDate}
                </p>
                <p style={{ margin: "5px 0", color: "#34495e", fontSize: "1em" }}>
                  <strong>Tổng:</strong> {order.grandTotal.toLocaleString()}₫
                </p>
                <p style={{
                  margin: "5px 0",
                  color: order.status === "Hoàn thành" ? "#27ae60" : "#e74c3c",
                  fontSize: "1em",
                  fontWeight: "500"
                }}>
                  <strong>Trạng thái:</strong> {order.status}
                </p>
                <div style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  alignItems: "center",
                  marginTop: "10px"
                }}>
                  {order.orderDetails.length > 0 ? (
                    order.orderDetails.map((item) => (
                      <div key={item.idOrderDetail} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {item.product ? (
                          <>
                            <img
                              src={`${imageBaseUrl}${item.product.images[0].imageLink}`}
                              alt={item.product.name_product}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                border: "1px solid #ddd"
                              }}
                            />
                            <div>
                              <span style={{ fontSize: "0.9em", color: "#34495e" }}>
                                {item.product.name_product}
                              </span>
                              <span style={{ margin: "0 5px", color: "#bdc3c7" }}> | </span>
                              <span style={{ fontSize: "0.9em", color: "#34495e" }}>
                                Số lượng: {item.quantity}
                              </span>
                              <span style={{ margin: "0 5px", color: "#bdc3c7" }}> | </span>
                              <span style={{ fontSize: "0.9em", color: "#34495e" }}>
                                Kích thước: {item.size}
                              </span>
                            </div>
                          </>
                        ) : (
                          <span style={{ color: "#e74c3c", fontSize: "0.9em" }}>
                            Sản phẩm không tồn tại
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <span style={{ color: "#e74c3c", fontSize: "0.9em" }}>
                      Sản phẩm không tồn tại
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p style={{
              fontSize: "1.2em",
              textAlign: "center",
              color: "#e74c3c",
              fontStyle: "italic",
              marginTop: "30px"
            }}>
              Bạn chưa có đơn hàng nào!
            </p>
          )}
        </div>

        {/* Cột phải - Chi tiết đơn hàng */}
        <div className="order-details" style={{
          flex: 2,
          minWidth: "300px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "20px"
        }}>
          <h2 style={{
            fontSize: "1.8em",
            color: "#2c3e50",
            marginBottom: "20px",
            fontWeight: "600",
            textAlign: "center"
          }}>
            Chi Tiết Đơn Hàng
          </h2>
          {selectedOrder ? (
            <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
              {/* Thông tin đơn hàng bên trái */}
              <div style={{ flex: 1, minWidth: "300px" }}>
                <div style={{
                  padding: "15px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px"
                }}>
                  <p><strong>Ngày đặt:</strong> {selectedOrder.orderDate}</p>
                  <p><strong>Địa chỉ giao hàng:</strong> {selectedOrder.address}</p>
                  <p><strong>Số điện thoại:</strong> {selectedOrder.phoneNumber}</p>
                  <p><strong>Cước giao hàng:</strong> {selectedOrder.shippingFee.toLocaleString()}₫</p>
                  <p><strong>Tổng cộng:</strong> {selectedOrder.grandTotal.toLocaleString()}₫</p>
                  <p style={{ color: selectedOrder.status === "Hoàn thành" ? "#27ae60" : "#e74c3c", fontWeight: "500" }}>
                    <strong>Trạng thái:</strong> {selectedOrder.status}
                  </p>
                </div>

                {/* Thumbnails nếu có nhiều sản phẩm */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "20px" }}>
                  {selectedOrder.orderDetails.map((item) => (
                    item.product && item.product.images.length > 0 && (
                      <img
                        key={item.idOrderDetail}
                        src={`${imageBaseUrl}${item.product.images[0].imageLink}`}
                        alt={item.product.name_product}
                        onClick={() => setSelectedImage(`${imageBaseUrl}${item.product.images[0].imageLink}`)}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          cursor: "pointer",
                          border: selectedImage === `${imageBaseUrl}${item.product.images[0].imageLink}` ? "2px solid #007bff" : "1px solid #ddd"
                        }}
                      />
                    )
                  ))}
                </div>
              </div>

              {/* Ảnh to bên phải */}
              <div style={{ flex: 1, minWidth: "280px", textAlign: "center" }}>
                {(() => {
                  const selectedDetail = selectedOrder.orderDetails.find(item =>
                    item.product && item.product.images.length > 0 &&
                    `${imageBaseUrl}${item.product.images[0].imageLink}` === selectedImage
                  );
                  const defaultDetail = selectedOrder.orderDetails.find(item => item.product && item.product.images.length > 0);

                  const imageToShow = selectedImage || (defaultDetail && `${imageBaseUrl}${defaultDetail.product.images[0].imageLink}`);
                  const nameToShow = selectedDetail?.product?.name_product || defaultDetail?.product?.name_product;

                  return imageToShow ? (
                    <>
                      <img
                        src={imageToShow}
                        alt={nameToShow}
                        style={{
                          width: "300px",
                          height: "300px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          border: "1px solid #ccc",
                          marginBottom: "15px"
                        }}
                      />
                      <p style={{ fontWeight: "bold", color: "#2c3e50" }}>{nameToShow}</p>
                    </>
                  ) : (
                    <p style={{ color: "#e74c3c" }}>Không có ảnh hiển thị</p>
                  );
                })()}
              </div>
            </div>
          ) : (
            <p style={{
              fontSize: "1.4em",
              textAlign: "center",
              color: "#7f8c8d",
              fontStyle: "italic",
              marginTop: "50px"
            }}>
              Vui lòng chọn một đơn hàng để xem chi tiết.
            </p>
          )}

        </div>
      </div>
      <div
        className="pagination-section"
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px"
        }}
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

export default MyOrders;