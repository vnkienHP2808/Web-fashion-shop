import React, { createContext, useState, useEffect } from "react";
import instance from "../utils/axiosInstance";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const storedUser = localStorage.getItem("account");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

  const fetchCartFromServer = async () => {
    if (!loggedInUser) return;
    try {
      const res = await instance.get(`/api/cart/${loggedInUser.id_user}`);
      setCart(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    }
  };

  const addToCart = async (product) => {
    if (!loggedInUser) return;
    try {
      await instance.post("/api/cart/add", {
        id_user: loggedInUser.id_user,
        productId: product.idProduct,
        quantity: product.quantity,
        size: product.size,
      });
      fetchCartFromServer();
    } catch (err) {
      console.error("Lỗi thêm sản phẩm vào giỏ hàng:", err);
    }
  };

  const updateCartItemQuantity = async (productId, quantity, size) => {
    try {
      await instance.put("/api/cart/update", {
        id_user: loggedInUser.id_user,
        productId,
        quantity,
        size,
      });
      fetchCartFromServer();
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
    }
  };

  const removeFromCart = async (productId, size) => {
    try {
      await instance.delete(`/api/cart/${loggedInUser.id_user}/remove/${productId}/${size}`);
      fetchCartFromServer();
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
    }
  };

  const clearCart = async () => {
    try {
      await instance.delete(`/api/cart/${loggedInUser.id_user}/clear`);
      fetchCartFromServer();
    } catch (err) {
      console.error("Lỗi xóa toàn bộ giỏ hàng:", err);
    }
  };

  useEffect(() => {
    if (loggedInUser && loggedInUser.role === "Customer") {
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