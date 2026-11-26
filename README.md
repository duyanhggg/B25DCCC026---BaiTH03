# ShopMini - Cửa Hàng Mini Trực Tuyến

Ứng dụng thương mại điện tử mini được xây dựng bằng **React**, **TypeScript** (sử dụng **Vite**), kết hợp quản lý trạng thái toàn cục với **Context API** và **Redux Toolkit**.

---

## 1. Phân chia State: `useState`, `Context API` và `Redux Toolkit`

Dự án phân chia các tầng dữ liệu rõ ràng theo phạm vi và tần suất thay đổi của dữ liệu:

| Dữ liệu | Công nghệ lưu trữ | Lý do lựa chọn |
|---|---|---|
| **Theme (Giao diện Sáng/Tối)** | **Context API** (`ThemeContext`) | • Thuộc dạng cài đặt/cấu hình giao diện toàn ứng dụng (UI metadata).<br>• Tần suất thay đổi rất thấp (chỉ khi người dùng bấm nút đổi theme).<br>• Không cần logic reducer/middleware phức tạp của Redux, Context API là lựa chọn nhẹ nhàng và tối ưu nhất. |
| **Auth (Người dùng & Xác thực)** | **Context API** (`AuthContext`) | • Trạng thái đăng nhập (`user`, `login`, `logout`) cần chia sẻ trên toàn ứng dụng để Header hiển thị tên và `ProtectedRoute` kiểm tra quyền truy cập.<br>• Tần suất cập nhật thấp (chỉ khi đăng nhập hoặc đăng xuất).<br>• Không liên quan đến tính toán hay luồng xử lý phức tạp của dữ liệu giỏ hàng hay sản phẩm. |
| **Products (Danh sách sản phẩm)** | **Redux Toolkit** (`productsSlice`) | • Cần gọi API bất đồng bộ (`createAsyncThunk`), quản lý 3 trạng thái của request: `loading`, `succeeded`, `failed`.<br>• Trạng thái sản phẩm được chia sẻ và tái sử dụng ở nhiều nơi (Trang chủ, Chi tiết sản phẩm, v.v.).<br>• Redux DevTools hỗ trợ theo dõi vòng đời fetch API dễ dàng. |
| **Cart (Giỏ hàng & Đơn hàng)** | **Redux Toolkit** (`cartSlice`) | • Có nhiều hành động thay đổi dữ liệu liên tục (`addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`).<br>• Cần các hàm tính toán phái sinh (Selectors) như: tổng số lượng sản phẩm (`selectTotalQuantity`) và tổng giá trị đơn hàng (`selectTotalPrice`).<br>• Luồng xử lý đơn hàng thay đổi xuyên suốt giữa ProductCard, ProductDetail, Header, Cart và Checkout. |
| **Dữ liệu cục bộ (Search, Form Inputs, Feedback)** | **useState** | • Từ khóa tìm kiếm (`searchTerm` ở Trang chủ).<br>• Dữ liệu form nhập liệu đăng nhập (`username`, `password`) hoặc địa chỉ giao hàng (`address`, `paymentMethod`).<br>• Trạng thái UI nhất thời như hiệu ứng "Đã thêm vào giỏ hàng" (`added`), trạng thái loading của form.<br>• Đây là các state độc lập của từng component, không cần chia sẻ ra ngoài. |

---

## 2. Tính năng chính

- **Trang chủ (`/`)**:
  - Hiển thị lưới sản phẩm responsive: 1 cột (điện thoại mobile), 2 cột (tablet), 4 cột (desktop).
  - Ô tìm kiếm sản phẩm theo tên theo thời gian thực.
  - Xử lý đầy đủ các trạng thái `loading`, `succeeded`, `failed` (thông báo lỗi và nút thử lại).
- **Chi tiết sản phẩm (`/products/:id`)**:
  - Xem thông tin chi tiết: ảnh lớn, thể loại, tiêu đề, mô tả và giá tiền.
  - Thêm sản phẩm vào giỏ hàng kèm hiệu ứng thông báo thành công.
- **Giỏ hàng (`/cart`)**:
  - Danh sách sản phẩm trong giỏ: tăng/giảm số lượng, xóa từng món, làm trống giỏ.
  - Tự động tính tổng tiền và tổng số lượng hàng.
- **Đăng nhập (`/login`)**:
  - Giả lập xác thực: Đăng nhập thành công khi **mật khẩu là `123456`**.
  - Tự động điều hướng về lại trang trước đó (ví dụ từ Checkout chuyển về Login, đăng nhập xong quay lại Checkout).
- **Thanh toán (`/checkout`)**:
  - Là **Protected Route**: Yêu cầu người dùng phải đăng nhập mới được vào trang.
  - Xem tóm tắt đơn hàng, nhập thông tin địa chỉ và chọn phương thức thanh toán.
  - Nút **"Đặt hàng"**: Xóa giỏ hàng và hiển thị giao diện thông báo đặt hàng thành công.
- **Trang 404 (`*`)**: Giao diện thông báo trang không tồn tại kèm nút quay về Trang chủ.
- **Header dùng chung**:
  - Huy hiệu (badge) hiển thị tổng số lượng sản phẩm trong giỏ theo thời gian thực.
  - Nút chuyển đổi Theme Sáng / Tối (Dark / Light mode).
  - Trạng thái đăng nhập: Hiển thị tên người dùng, nút Đăng xuất / Đăng nhập.

---

## 3. Cấu trúc thư mục

```
src/
├── app/
│   ├── store.ts              # configureStore, RootState, AppDispatch
│   └── hooks.ts              # useAppDispatch, useAppSelector chuẩn TypeScript
├── features/
│   ├── products/productsSlice.ts   # createAsyncThunk gọi FakeStore API
│   └── cart/cartSlice.ts           # addToCart, updateQuantity, removeFromCart, clearCart & selectors
├── contexts/
│   ├── ThemeContext.tsx      # ThemeProvider, useTheme
│   └── AuthContext.tsx       # AuthProvider, useAuth (pass: 123456)
├── components/
│   ├── Header.tsx            # Header dùng chung
│   ├── ProductCard.tsx       # Thẻ sản phẩm hiển thị trên lưới
│   └── ProtectedRoute.tsx    # Bảo vệ route /checkout
├── layouts/
│   └── MainLayout.tsx        # Layout chính chứa Header, Main Content, Footer
├── pages/
│   ├── HomePage.tsx          # Trang chủ + tìm kiếm
│   ├── ProductDetailPage.tsx # Trang chi tiết sản phẩm
│   ├── CartPage.tsx          # Trang giỏ hàng
│   ├── LoginPage.tsx         # Trang đăng nhập
│   ├── CheckoutPage.tsx      # Trang thanh toán
│   └── NotFoundPage.tsx      # Trang 404
├── types/
│   └── index.ts              # Định nghĩa interface Product, CartItem, User
├── App.tsx                   # Khai báo cấu trúc Routes
├── main.tsx                  # Bọc Provider, ThemeProvider, AuthProvider, BrowserRouter
└── index.css                 # CSS toàn cục & biến theme Sáng/Tối
```

---

## 4. Hướng dẫn chạy dự án

### Cài đặt và khởi chạy:
```bash
# Di chuyển vào thư mục dự án
cd shopmini

# Cài đặt thư viện nếu chưa có
npm install

# Chạy môi trường phát triển (Dev Server)
npm run dev
```

### Build kiểm tra TypeScript & đóng gói sản phẩm:
```bash
npm run build
```

---

