import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const storedUser = sessionStorage.getItem("account");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

  // Thiết lập interceptor cho axios để thêm header Authorization
  useEffect(() => {
    const auth = sessionStorage.getItem("auth");
    if (auth) {
      const interceptor = axios.interceptors.request.use((config) => {
        config.headers.Authorization = `Basic ${auth}`;
        return config;
      });
      // Cleanup interceptor khi component unmount
      return () => axios.interceptors.request.eject(interceptor);
    }
  }, []);

  const fetchCartFromServer = async () => {
    if (!loggedInUser) return;
    try {
      const res = await axios.get(`http://localhost:8080/api/cart/${loggedInUser.id_user}`);
      setCart(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    }
  };

  const addToCart = async (product) => {
    if (!loggedInUser) return;
    try {
      await axios.post("http://localhost:8080/api/cart/add", {
        id_user: loggedInUser.id_user,
        productId: product.idProduct,
        quantity: product.quantity,
      });
      fetchCartFromServer();
    } catch (err) {
      console.error("Lỗi thêm sản phẩm vào giỏ hàng:", err);
    }
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    try {
      await axios.put("http://localhost:8080/api/cart/update", {
        id_user: loggedInUser.id_user,
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