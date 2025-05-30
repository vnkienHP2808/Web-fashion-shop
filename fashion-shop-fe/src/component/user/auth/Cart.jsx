import React, { useContext, useEffect, useState } from "react";
import Footer from "../../layout/Footer";
import Header from "../../layout/Header";
import axios from "axios";
import Breadcrump from "../../ui/Breadcrump";
import { CartContext } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../../../style/cart.css";
import { Button, Modal, Form } from "react-bootstrap";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    updateCartItemQuantity,
  } = useContext(CartContext);

  const [showModal, setShowModal] = useState(false);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const imageBaseUrl = "http://localhost:8080/images/"; // link cho hình ảnh sản phẩm
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("account");
    if (!storedUser) {
      navigate("/sign-in");
      return;
    }

    const loggedInUser = JSON.parse(storedUser);
    if (!loggedInUser || loggedInUser.role !== "Customer") {
      navigate("/404");
      return;
    }

  }, [navigate]);

  const handleShowModal = (product) => {
    setProductToDelete(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProductToDelete(null);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      removeFromCart(productToDelete.product.idProduct, productToDelete.size);
      setSelectedProducts(
        selectedProducts.filter((id) => id !== productToDelete.product.idProduct)
      );
    }
    handleCloseModal();
  };

  const handleQuantityChange = (product, value, size) => {
    const quantity = parseInt(value, 10) || 1;
    if (quantity <= 0) {
      handleShowModal(product);
    } else if (quantity > product.product.in_stock) {
      updateCartItemQuantity(product.product.idProduct, product.product.in_stock, size);
    } else {
      updateCartItemQuantity(product.product.idProduct, quantity, size);
    }
  };

  const handleProductSelect = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === cart.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(cart.map((item) => item.product.idProduct));
    }
  };

  const handleClearAll = () => {
    setShowClearAllModal(true);
  };

  const confirmClearAll = () => {
    clearCart();
    setSelectedProducts([]);
    setShowClearAllModal(false);
  };

  const totalAmount = cart
    .filter((item) => selectedProducts.includes(item.product.idProduct))
    .reduce(
      (acc, item) =>
        acc +
        (item.product.sale_price ? item.product.sale_price : item.product.price) *
          item.quantity,
      0
    );

  const handleCheckout = () => {
    const selectedCartItems = cart.filter((item) =>
      selectedProducts.includes(item.product.idProduct)
    );
    navigate("/checkout", { state: { selectedCartItems } });
  };

  return (
    <div>
      <Header />
      <Breadcrump text={"Giỏ hàng"} />
      <div className="cart-container container mt-4">
        <h2 className="mb-4">Giỏ hàng của bạn</h2>
        <div className="row" style={{ marginLeft: "0" }}>
          <div className="col-md-8" style={{ paddingLeft: "0" }}>
            {cart.length > 0 && (
              <Button
                variant="outline-primary"
                onClick={handleSelectAll}
                style={{ marginBottom: "20px" }}
              >
                {selectedProducts.length === cart.length
                  ? "Bỏ chọn tất cả"
                  : "Chọn tất cả"}
              </Button>
            )}
            {cart.map((item, index) => (
              <React.Fragment key={item.product.idProduct}>
                <div className="cart-item d-flex align-items-center p-3">
                  <Form.Check
                    type="checkbox"
                    checked={selectedProducts.includes(item.product.idProduct)}
                    onChange={() =>
                      handleProductSelect(item.product.idProduct)
                    }
                    className="me-3"
                  />
                  <a href={`/products/${item.product.idProduct}`} className="product-name">
                    <img
                      src = {`${imageBaseUrl}${item.product.images[0].imageLink}`}
                      alt={item.product.name_product}
                      className="cart-item-image"
                    />
                  </a>
                  <div className="cart-item-details ms-3">
                    <a href={`/products/${item.product.idProduct}`} className="product-name">
                      <h4>{item.product.name_product}</h4>
                    </a>
                    <p> Giá: &nbsp;
                      {item.product.sale_price ? (
                        <>
                          <span
                            style={{ color: "red", fontWeight: "bold" }}
                          >
                            {item.product.sale_price}₫
                          </span>
                          <span
                            style={{
                              color: "gray",
                              textDecoration: "line-through",
                              marginLeft: "10px",
                            }}
                          >
                            {item.product.price}₫
                          </span>
                        </>
                      ) : (
                        <span>{item.product.price}₫</span>
                      )}
                    </p>
                      <p>Kích thước: {item.size}</p>
                    <div className="quantity-controls d-flex align-items-center">
                      <Button
                        variant="light"
                        onClick={() =>
                          handleQuantityChange(item, item.quantity - 1, item.size)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <i className="bi bi-dash-lg"></i>
                      </Button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item, e.target.value, item.size)
                        }
                        className="quantity-input mx-2"
                        style={{ width: "50px", textAlign: "center" }}
                        min="1"
                        max={item.product.in_stock}
                      />
                      <Button
                        variant="light"
                        onClick={() =>
                          handleQuantityChange(item, item.quantity + 1, item.size)
                        }
                        disabled={item.quantity >= item.product.in_stock}
                      >
                        <i className="bi bi-plus-lg"></i>
                      </Button>
                    </div>
                    <small className="text-muted">
                      {item.product.in_stock} sản phẩm có sẵn
                    </small>
                  </div>
                  <Button
                    variant="danger"
                    onClick={() => handleShowModal(item)}
                    className="ms-auto"
                  >
                    Xóa
                  </Button>
                </div>
                {index < cart.length - 1 && <hr />}
              </React.Fragment>
            ))}
          </div>
          <div className="col-md-4">
            <div className="order-summary p-3 border" style={{ width: "360px" }}>
              <h4>Thông tin đơn hàng</h4>
              <p className="d-flex justify-content-between" style={{ fontSize: "18px" }}>
                Tổng tiền: <span>{totalAmount.toLocaleString()}₫</span>
              </p>
              <hr />
              <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                <li>Phí vận chuyển sẽ được tính ở trang thanh toán.</li>
              </ul>
              <Button
                variant="dark"
                className="w-100"
                onClick={handleCheckout}
                disabled={selectedProducts.length === 0}
              >
                Thanh toán
              </Button>
            </div>
          </div>
        </div>

        {cart.length > 0 && (
          <Button
            variant="outline-danger"
            onClick={handleClearAll}
            className="mt-4"
          >
            Xóa tất cả
          </Button>
        )}

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showClearAllModal} onHide={() => setShowClearAllModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa tất cả</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowClearAllModal(false)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={confirmClearAll}>
              Xóa tất cả
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
