# Fashion Shop — Frontend

Giao diện người dùng cho ứng dụng thương mại điện tử thời trang, xây dựng bằng React 19 + Vite. Hỗ trợ đầy đủ trải nghiệm mua sắm cho Customer và dashboard quản trị cho Admin.

---

## Tech Stack

| | |
|---|---|
| **Framework** | React 19 · Vite 6 |
| **Routing** | React Router DOM v7 |
| **HTTP Client** | Axios (với interceptor tự động refresh JWT) |
| **UI** | React Bootstrap · Bootstrap 5 · Bootstrap Icons · Boxicons |
| **Auth** | JWT (Access Token + Refresh Token) lưu tại `localStorage` |

---

## Yêu cầu

- Node.js 18+
- npm hoặc yarn
- Backend đang chạy tại `http://localhost:8080` — xem [fashion-shop-be](https://github.com/vnkienHP2808/fashion-shop-be)

---

## Cài đặt và chạy

**1. Clone repository**
```bash
git clone https://github.com/vnkienHP2808/Web-fashion-shop.git
cd Web-fashion-shop/fashion-shop-fe
```

**2. Cài dependencies**
```bash
npm install
```

**3. Chạy development server**
```bash
npm run dev
```

Ứng dụng chạy tại `http://localhost:5173`

**4. Build production**
```bash
npm run build
```

---

## Cấu trúc project

```
src/
├── api/
│   └── axiosInstance.js        # Axios instance với JWT interceptor
├── component/
│   ├── layout/
│   │   ├── Header.jsx          # Navbar, dropdown tài khoản, giỏ hàng
│   │   └── Footer.jsx
│   ├── product/                # ProductCard, ProductList, NewArrival, SaleProduct...
│   ├── ui/                     # Breadcrumb, Pagination, Filter, Slider, 404...
│   └── user/
│       ├── auth/               # Cart, Checkout, SignIn, SignUp, Profile, ChangePw, MyOrder
│       └── admin/              # Dashboard, ProductManagement, OrderManagement, UserManagement
├── context/
│   └── CartContext.jsx         # Global cart state, sync với server
├── page/                       # Page-level components (wrap components + routing)
└── App.jsx                     # Route definitions
```

---

## Các trang

### Public (không cần đăng nhập)

| Route | Trang |
|-------|-------|
| `/` | Trang chủ |
| `/sign-in` | Đăng nhập |
| `/sign-up` | Đăng ký |
| `/products/all` | Tất cả sản phẩm |
| `/products/new` | Hàng mới về |
| `/products/sale` | Hàng giảm giá |
| `/products/:id` | Chi tiết sản phẩm |
| `/products/category/:id` | Sản phẩm theo danh mục |
| `/products/category/:id/subcategory/:id` | Sản phẩm theo danh mục con |
| `/search` | Tìm kiếm sản phẩm |

### Customer (cần đăng nhập)

| Route | Trang |
|-------|-------|
| `/cart` | Giỏ hàng |
| `/checkout` | Thanh toán |
| `/myorder` | Đơn hàng của tôi |
| `/profile` | Thông tin tài khoản |
| `/change-password` | Đổi mật khẩu |

### Admin (cần role Admin)

| Route | Trang |
|-------|-------|
| `/admin` | Dashboard |
| `/admin/products` | Quản lý sản phẩm |
| `/admin/orders` | Quản lý đơn hàng |
| `/admin/users` | Quản lý người dùng |
| `/updateproduct/:id` | Cập nhật sản phẩm |

---

## Cơ chế xác thực JWT

Sau khi đăng nhập, server trả về `accessToken` (15 phút) và `refreshToken` (7 ngày), được lưu vào `localStorage`.

`axiosInstance.js` xử lý toàn bộ auth flow tập trung:

```
Mọi request gửi đi
  → interceptor tự gắn: Authorization: Bearer <accessToken>

Nhận lỗi 401 (token hết hạn)
  → tự động gọi POST /auth/refresh
  → lưu cặp token mới vào localStorage
  → retry request gốc với token mới
  → user không bị gián đoạn

Refresh token cũng hết hạn
  → xóa localStorage, redirect về /sign-in
```

---

## Phân quyền phía client

- `AdminRoute.jsx` — bọc các route Admin, redirect về `/404` nếu role không phải Admin
- `localStorage.getItem("account")` — lưu thông tin user (id, name, email, role) sau khi đăng nhập
- Header tự ẩn/hiện các mục menu dựa theo role

---

## Backend Repository

https://github.com/vnkienHP2808/fashion-shop-be