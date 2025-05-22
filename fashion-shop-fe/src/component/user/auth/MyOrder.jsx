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
  const [ordersPerPage] = useState(5);

  const [openFilter, setOpenFilter] = useState(false); 
  const [selectedGrandTotalRange, setSelectedGrandTotalRange] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null); 
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: "",
    endDate: "",
  }); 

  const imageBaseUrl = "http://localhost:8080/images/"; // link cho hình ảnh sản phẩm
  // Thiết lập interceptor cho axios để thêm header Authorization
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
        .get(`http://localhost:8080/api/orders/user/${userId}`, {params})
        .then((res) => {
            setOrders(Array.isArray(res.data.content) ? res.data.content : []);
            setTotalPages(res.data.totalPages);
            setTotalElements(res.data.totalElements || 0);
        })
        .catch((error) => console.error("Lỗi khi lấy đơn hàng:", error));
    }
  }, [userId,
      currentPage,
      selectedGrandTotalRange,
      selectedStatus,
      selectedDateRange,
  ]);

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
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Cột trái - Danh sách đơn */}
        <div style={{ flex: 1, maxWidth: "400px" }}>
          <h2>Đơn Hàng Của Tôi: {totalElements}</h2>
          <div
            className="d-flex align-items-center justify-content-end"
            style={{ marginBottom: "10px" }}
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
                  setSelectedImage(null); // Đặt lại selectedImage khi chọn đơn hàng mới
                }}
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
                              src={`${imageBaseUrl}${item.product.images[0].imageLink}`}
                              alt={item.product.name_product}
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                            />
                            <span>{item.product.name_product}</span>
                            <span>  | </span>
                            <span>Số lượng: {item.quantity}</span>
                          </>
                        ) : (
                          <span style={{ color: "red" }}>
                            Sản phẩm không tồn tại
                          </span>
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
            <p style={{ fontSize: "18px", textAlign: "center", color: "red"}}>
              <i>Bạn chưa có đơn hàng nào!</i>
            </p>
          )}
        </div>

        {/* Cột phải - Chi tiết đơn hàng */}
        <div style={{ flex: 2, borderLeft: "1px solid #ccc", paddingLeft: "20px" }}>
          <h2>Chi Tiết Đơn Hàng</h2>
          {selectedOrder ? (
            <div>
              {/* Phần thông tin chi tiết */}
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <p style={{ fontSize: "18px" }}>
                  <strong>Ngày đặt:</strong> {selectedOrder.orderDate}
                </p>
                <p style={{ fontSize: "18px" }}>
                  <strong>Địa chỉ giao hàng:</strong> {selectedOrder.address}
                </p>
                <p style={{ fontSize: "18px" }}>
                  <strong>Số điện thoại nhận hàng:</strong>{" "}
                  {selectedOrder.phoneNumber}
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

              {/* Phần hình ảnh sản phẩm */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
                {selectedOrder.orderDetails.length > 0 ? (
                  selectedOrder.orderDetails.map((item) => (
                    <div
                      key={item.idOrderDetail}
                      style={{
                        margin: "15px 0",
                        padding: "15px",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        backgroundColor: "#fff",
                        width: "45%", // Đảm bảo mỗi sản phẩm chiếm ~50% chiều rộng để tối đa 2 sản phẩm mỗi hàng
                        boxSizing: "border-box",
                      }}
                    >
                      {item.product ? (
                        <>
                          <div style={{ textAlign: "center" }}>
                            <img
                              src={
                                selectedImage || `${imageBaseUrl}${item.product.images[0].imageLink}`
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
                                onClick={() => setSelectedImage(`${imageBaseUrl}${image.imageLink}`)}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                  border:
                                    selectedImage === `${imageBaseUrl}${image.imageLink}`
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
            </div>
          ) : (
            <p style={{ fontSize: "22px", textAlign: "center" }}>
              <i>Vui lòng chọn một đơn hàng để xem chi tiết.</i>
            </p>
          )}
        </div>
      </div>
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

export default MyOrders;