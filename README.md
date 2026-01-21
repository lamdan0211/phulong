# Phu Long DotNet Project

Dự án này là một hệ quản trị nội dung (CMS) đơn giản được xây dựng trên nền tảng .NET 8 cho website **Essensia Broadway - Phú Long**. Hệ thống cho phép quản lý nội dung, hình ảnh, và các tùy chỉnh khác của website thông qua giao diện Admin.

Đặc biệt, hệ thống này được thiết kế để chuyển đổi việc lưu trữ dữ liệu từ Firebase sang Local JSON Storage, giúp website hoạt động độc lập, tăng tốc độ truy cập và dễ dàng quản lý hơn.

## 🚀 Công nghệ sử dụng

- **Framework:** .NET 8.0 (ASP.NET Core)
- **UI:** Razor Pages
- **API:** Controller-based API cho việc tương tác dữ liệu
- **Dữ liệu:** Lưu trữ dạng file JSON (`Data/*.json`) thay vì Database truyền thống, giúp triển khai nhanh và nhẹ nhàng.
- **Xác thực:** Cookie-based Authentication
- **Thư viện chính:** System.Text.Json, Microsoft.AspNetCore.Authentication.Cookies

## ✨ Các tính năng chính

- **Quản lý nội dung:** Thay đổi các đoạn text, văn bản trên website (`content.json`).
- **Quản lý hình ảnh:** Cập nhật các đường dẫn ảnh, banner (`images.json`).
- **Quản lý Popup:** Cấu hình các thông báo popup trên trang chủ (`popups.json`).
- **Quản lý tài khoản:** Thêm/sửa người dùng có quyền truy cập Admin (`users.json`).
- **Upload hình ảnh:** Tích hợp tính năng upload file trực tiếp vào thư mục `wwwroot/uploads`.

## 📂 Cấu trúc dự án

- `/Controllers`: Chứa `DataController.cs` xử lý các API đọc/ghi dữ liệu.
- `/Services`: Chứa `JsonDataService.cs` - Service trung gian xử lý logic với file JSON.
- `/Pages`: Chứa các trang Razor Pages của website và giao diện Admin.
- `/Data`: Chứa các file cấu hình và dữ liệu JSON.
- `/wwwroot`: Chứa các tài nguyên tĩnh như CSS, JS và thư mục ảnh upload.

## 🛠️ Hướng dẫn cài đặt và chạy

1.  **Yêu cầu:** Đã cài đặt [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0).
2.  **Clone dự án** và mở thư mục trong Terminal hoặc VS Code.
3.  **Chạy dự án:**
    ```bash
    dotnet watch run
    ```
4.  **Truy cập:**
    - Website chính: `http://localhost:5002` (hoặc port được chỉ định trong `Properties/launchSettings.json`)
    - Trang Admin: `http://localhost:5002/Admin`

## 🔐 Thông tin đăng nhập mặc định (Môi trường phát triển)

- **Tài khoản:** `admin`
- **Mật khẩu:** `password123`

_(Lưu ý: Bạn nên thay đổi mật khẩu ngay sau khi triển khai thực tế)_

## 📝 Giấy phép

Dự án này được phát triển cho mục đích quản lý website nội bộ của dự án Phú Long.
