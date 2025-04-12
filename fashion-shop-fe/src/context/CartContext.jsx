import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const storedUser = sessionStorage.getItem("account");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

  const fetchCartFromServer = async () => {
    if (!loggedInUser) return;
    try {
      const res = await axios.get(`http://localhost:8080/api/cart/${loggedInUser.id_user}`);
      setCart(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng từ server:", error);
    }
  };

  const addToCart = async (product) => {
    if (!loggedInUser) return;
    try {
      await axios.post("http://localhost:8080/api/cart/add", {
        userId: loggedInUser.id_user,
        productId: product.idProduct,
        quantity: 1,
      });
      fetchCartFromServer();
    } catch (err) {
      console.error("Lỗi thêm sản phẩm vào giỏ hàng:", err);
    }
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    try {
      await axios.put("http://localhost:8080/api/cart/update", {
        userId: loggedInUser.id_user,
        productId,
        quantity,
      });
      fetchCartFromServer();
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:8080/api/cart/${loggedInUser.id_user}/remove/${productId}`);
      fetchCartFromServer();
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/cart/${loggedInUser.id_user}/clear`);
      fetchCartFromServer();
    } catch (err) {
      console.error("Lỗi xóa toàn bộ giỏ hàng:", err);
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      fetchCartFromServer();
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        fetchCartFromServer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};