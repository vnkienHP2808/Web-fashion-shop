import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import "../../style/filter.css"

const Filter = ({
  categories,
  selectedCategory,
  handleCategoryChange,
  selectedPriceRange,
  handlePriceRangeChange,
  selectedOccasion,
  handleOccasionChange,
  openFilter,
  setOpenFilter,
}) => {
  return (
    <div>
      <span
      // bấm mở bảng filter
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
        <button className="close-btn" onClick={() => setOpenFilter(false)}>
          <i class="bi bi-x"></i>
        </button>
        <div style={{ padding: "10px" }}>
          <Row>
            <Col>
              <h6>Loại sản phẩm</h6>
              {categories.map((category) => (
                <Form.Check
                  type="checkbox"
                  key={category.id}
                  label={category.name}
                  value={category.id}
                  checked={selectedCategory.includes(category.id.toString())}
                  onChange={handleCategoryChange}
                />
              ))}
            </Col>

            <Col>
              <h6>Khoảng giá</h6>
              <Form.Check
                type="checkbox"
                label="Dưới 200.000"
                value="0-200000"
                checked={selectedPriceRange.includes("0-200000")}
                onChange={handlePriceRangeChange}
              />
              <Form.Check
                type="checkbox"
                label="200.000 - 500.000"
                value="200000-500000"
                checked={selectedPriceRange.includes("200000-500000")}
                onChange={handlePriceRangeChange}
              />
              <Form.Check
                type="checkbox"
                label="Trên 500.000"
                value="500000-9999999"
                checked={selectedPriceRange.includes("500000-9999999")}
                onChange={handlePriceRangeChange}
              />
            </Col>

            <Col>
              <h6>Theo dịp</h6>
              <Form.Check
                type="checkbox"
                label="Đi chơi"
                value="Đi chơi"
                checked={selectedOccasion.includes("Đi chơi")}
                onChange={handleOccasionChange}
              />
              <Form.Check
                type="checkbox"
                label="Đi làm"
                value="Đi làm"
                checked={selectedOccasion.includes("Đi làm")}
                onChange={handleOccasionChange}
              />
              <Form.Check
                type="checkbox"
                label="Đi tiệc"
                value="Đi tiệc"
                checked={selectedOccasion.includes("Đi tiệc")}
                onChange={handleOccasionChange}
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Filter;
