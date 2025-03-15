import React, { createContext, useState, useEffect } from "react";
export const CartContext = createContext();  //tạo Context để chia sẻ dữ liệu toàn bộ web

/*  lưu giỏ hàng vào localStorage lưu dữ liệu sau khi tải lại
    cung cấp các hàm thao tác: thêm, xóa, cập nhật
    biết được các thay đổi từ các tab khác trong web
*/

export const CartProvider = ({ children }) => { //bọc toàn bộ ứng dụng để chia sẻ dữ liệu giỏ hàng
    // lấy dữ liệu từ local, nếu đã có thì set vào, 0 thì quy định là mảng rỗng
    const [cart, setCart] = useState(() => { // cart để lưu sản phẩm trong giỏ (mảng)
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    });


  useEffect(() => {
    // cập nhật giỏ vào vào local
    // giỏ trống => xóa
    if (cart.length === 0) {
      localStorage.removeItem("cart");
    } else {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    console.log("Cart saved to localStorage:", cart);
  }, [cart]);

  useEffect(() => {
    // dùng để trong TH mở 2 tab, 1 tab thay đổi thì tab còn lại cũng thay đổi theo
    const handleStorageChange = (event) => {
      if (event.key === "cart") {
        const newCart = event.newValue ? JSON.parse(event.newValue) : [];
        setCart(newCart);
        console.log("Cart updated from another tab:", newCart);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const addToCart = (product) => {
    //ktra xem sp có trong giỏ hàng 0
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.id === product.id
      );

      // nếu có: +1 số lg
      if (existingProductIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: updatedCart[existingProductIndex].quantity + 1,
        };
        return updatedCart;
      // 0: mặc định là 1
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    // xóa giỏ hàng theo lọc những sp 0 có id giống sp cần xóa
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    // xóa toàn bộ giỏ hàng = set mặc định trống luôn
    setCart([]);
  };

  const updateCartItemQuantity = (productId, quantity) => {
    // cập nhật bằng cách duyệt mảng để tìm sp có id trừng sp cần thay đổi
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  return (
    <CartContext.Provider 
        //share giỏ hàng và các hàm thao tác tới toàn bộ web
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItemQuantity,
      }} // Thêm updateCartItemQuantity vào đây
    >
      {children} {/*các component con sử dụng dữ liệu này*/}
    </CartContext.Provider>
  );
};
