import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import "../../style/filter.css";

const Filter = ({
  categories,
  selectedCategory,
  selectedSubCategory,
  handleCategoryChange,
  handleSubCategoryChange,
  selectedPriceRange,
  handlePriceRangeChange,
  selectedOccasion,
  handleOccasionChange,
  openFilter,
  setOpenFilter,
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  useEffect(() => {
    // Cập nhật activeCategoryId khi selectedCategory thay đổi
    if (selectedCategory !== null) {
      setActiveCategoryId(selectedCategory);
    } else {
      setActiveCategoryId(null);
    }
  }, [selectedCategory]);

  const selectedCategoryObj = categories.find((cat) => cat.id === activeCategoryId);

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
        <button className="close-btn" onClick={() => setOpenFilter(false)}>
          <i className="bi bi-x"></i>
        </button>

        <div style={{ padding: "10px" }}>
          <Row>
            {/* --- LỌC DANH MỤC --- */}
            <Col>
              <h6>Loại sản phẩm</h6>
              {categories.map((cat) => (
                <Form.Check
                  type="checkbox"
                  name="category"
                  key={cat.id}
                  label={cat.name}
                  value={cat.id}
                  checked={selectedCategory === cat.id}
                  onChange={(e) =>
                    handleCategoryChange({
                      target: {
                        value: e.target.value,
                        checked: e.target.checked,
                      },
                    })
                  }
                />
              ))}

              {selectedCategoryObj && (
                <div style={{ paddingLeft: "10px", marginTop: "10px" }}>
                  <h6>Loại chi tiết</h6>
                  {selectedCategoryObj.subCategories.map((sub) => (
                    <Form.Check
                      type="checkbox"
                      name="subCategory"
                      key={sub.id_subcat}
                      label={sub.name}
                      value={sub.id_subcat}
                      checked={selectedSubCategory === sub.id_subcat}
                      onChange={(e) =>
                        handleSubCategoryChange({
                          target: {
                            value: parseInt(e.target.value),
                            checked: e.target.checked,
                          },
                        })
                      }
                    />
                  ))}
                </div>
              )}
            </Col>

            {/* --- LỌC GIÁ --- */}
            <Col>
              <h6>Khoảng giá</h6>
              <Form.Check
                type="checkbox"
                name="priceRange"
                label="Dưới 200.000"
                value="0-200000"
                checked={selectedPriceRange === "0-200000"}
                onChange={handlePriceRangeChange}
              />
              <Form.Check
                type="checkbox"
                name="priceRange"
                label="200.000 - 500.000"
                value="200000-500000"
                checked={selectedPriceRange === "200000-500000"}
                onChange={handlePriceRangeChange}
              />
              <Form.Check
                type="checkbox"
                name="priceRange"
                label="Trên 500.000"
                value="500000-9999999"
                checked={selectedPriceRange === "500000-9999999"}
                onChange={handlePriceRangeChange}
              />
            </Col>

            {/* --- LỌC THEO DỊP --- */}
            <Col>
              <h6>Theo dịp</h6>
              <Form.Check
                type="checkbox"
                name="occasion"
                label="Đi chơi"
                value="Đi chơi"
                checked={selectedOccasion === "Đi chơi"}
                onChange={handleOccasionChange}
              />
              <Form.Check
                type="checkbox"
                name="occasion"
                label="Đi làm"
                value="Đi làm"
                checked={selectedOccasion === "Đi làm"}
                onChange={handleOccasionChange}
              />
              <Form.Check
                type="checkbox"
                name="occasion"
                label="Đi tiệc"
                value="Đi tiệc"
                checked={selectedOccasion === "Đi tiệc"}
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