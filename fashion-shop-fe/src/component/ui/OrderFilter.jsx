import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const OrderFilter = ({
  selectedGrandTotalRange,
  handleGrandTotalRangeChange,
  selectedStatus,
  handleStatusChange,
  selectedDateRange,
  handleDateRangeChange,
  openFilter,
  setOpenFilter,
}) => {
  return (
    <div>
      <span
        onClick={() => setOpenFilter(!openFilter)}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        Bộ lọc
        <span style={{ marginLeft: "5px" }}>
          <i className={`bi bi-chevron-${openFilter ? "up" : "down"}`}></i>
        </span>
      </span>

      <div className={`filter-sidebar ${openFilter ? "active" : ""}`}>
        <button
          className="close-btn"
          onClick={() => setOpenFilter(false)}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            position: "absolute",
            right: "10px",
            top: "10px",
          }}
        >
          <i className="bi bi-x"></i>
        </button>

        <div style={{ padding: "10px" }}>
          <Row>
            {/* --- LỌC THEO GRAND TOTAL --- */}
            <Col>
              <h6>Khoảng tổng tiền</h6>
              <Form.Check
                type="checkbox"
                name="grandTotalRange"
                label="Dưới 500.000"
                value="0-500000"
                checked={selectedGrandTotalRange === "0-500000"}
                onChange={handleGrandTotalRangeChange}
              />
              <Form.Check
                type="checkbox"
                name="grandTotalRange"
                label="500.000 - 2.000.000"
                value="500000-2000000"
                checked={selectedGrandTotalRange === "500000-2000000"}
                onChange={handleGrandTotalRangeChange}
              />
              <Form.Check
                type="checkbox"
                name="grandTotalRange"
                label="Trên 2.000.000"
                value="2000000-9999999"
                checked={selectedGrandTotalRange === "2000000-9999999"}
                onChange={handleGrandTotalRangeChange}
              />
            </Col>

            {/* --- LỌC THEO TRẠNG THÁI --- */}
            <Col>
              <h6>Trạng thái</h6>
              <Form.Check
                type="checkbox"
                name="status"
                label="Chờ thanh toán"
                value="Chờ thanh toán"
                checked={selectedStatus === "Chờ thanh toán"}
                onChange={handleStatusChange}
              />
              <Form.Check
                type="checkbox"
                name="status"
                label="Chờ nhận hàng"
                value="Chờ nhận hàng"
                checked={selectedStatus === "Chờ nhận hàng"}
                onChange={handleStatusChange}
              />
              <Form.Check
                type="checkbox"
                name="status"
                label="Đang giao hàng"
                value="Đang giao hàng"
                checked={selectedStatus === "Đang giao hàng"}
                onChange={handleStatusChange}
              />
              <Form.Check
                type="checkbox"
                name="status"
                label="Đã giao hàng"
                value="Đã giao hàng"
                checked={selectedStatus === "Đã giao hàng"}
                onChange={handleStatusChange}
              />
              <Form.Check
                type="checkbox"
                name="status"
                label="Hoàn thành"
                value="Hoàn thành"
                checked={selectedStatus === "Hoàn thành"}
                onChange={handleStatusChange}
              />
              <Form.Check
                type="checkbox"
                name="status"
                label="Yêu cầu hoàn trả"
                value="Yêu cầu hoàn trả"
                checked={selectedStatus === "Yêu cầu hoàn trả"}
                onChange={handleStatusChange}
              />
            </Col>

            {/* --- LỌC THEO NGÀY ĐẶT HÀNG --- */}
            <Col>
              <h6>Khoảng ngày đặt hàng</h6>
              <Form.Group controlId="startDate">
                <Form.Label>Từ ngày</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={selectedDateRange.startDate || ""}
                  onChange={(e) =>
                    handleDateRangeChange({
                      target: { name: "startDate", value: e.target.value },
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="endDate">
                <Form.Label>Đến ngày</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={selectedDateRange.endDate || ""}
                  onChange={(e) =>
                    handleDateRangeChange({
                      target: { name: "endDate", value: e.target.value },
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default OrderFilter;