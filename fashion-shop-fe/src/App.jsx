import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "boxicons/css/boxicons.min.css";
import HomePage from "./page/homePage";
import SignInPage from "./page/SignInPage";
import SignUpPage from "./page/SignUpPage";
import UserProfile from "./page/UserProfile";
import ChangePassword from "./page/ChangePage";
import AllProduct from "./page/ShowAllProduct";
import AllNewProduct from "./page/ShowNewProduct";
import AllSaleProduct from "./page/ShowSaleProduct";
import CategoryProduct from "./page/CategoryProduct";
import ProductDetail from "./page/ProductDetail";
import Cart from "./component/user/auth/Cart";
import NotFound from "./component/ui/404";
import { CartProvider } from "./context/CartContext";
import Checkout from "./component/user/auth/CheckOut";
import AdminDashboard from "./component/user/admin/DashBoard";
import AdminRoute from "./component/user/admin/AdminRoute";
import ProductManagement from "./component/user/admin/ProductManagement";
import OrderManagement from "./component/user/admin/OrderManagement";
import UserManagement from "./component/user/admin/UserManagement";
import UpdateProduct from "./component/user/admin/UpdateProduct";

function App() {
  return (
    // route của các trang
    <CartProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/products/all" element={<AllProduct />} />
        <Route path="/products/new" element={<AllNewProduct />} />
        <Route path="/products/sale" element={<AllSaleProduct />} />
        <Route path="/products/category/:categoryId" element={<CategoryProduct />} />
        <Route
          path="/products/category/:categoryId/subcategory/:subcategoryId"
          element={<CategoryProduct />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<AdminDashboard />}></Route>
        <Route path="/admin/products"
          element={
            <AdminRoute>
              <ProductManagement />
            </AdminRoute>
          }
        />

        <Route path="/admin/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />

        <Route path="/admin/orders"
          element={
            <AdminRoute>
              <OrderManagement />
            </AdminRoute>
          }
        />

        <Route path="/updateproduct/:id" element={<UpdateProduct/>} />
      </Routes>
    </CartProvider>
  );
}

export default App;
