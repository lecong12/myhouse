# MyHouse Manager - Hệ thống Quản lý Xây dựng & Tài chính

Đây là ứng dụng web quản lý dự án xây dựng nhà ở gia đình, được xây dựng trên nền tảng **Next.js (App Router)** và **MongoDB**. Hệ thống giúp theo dõi dòng tiền, tiến độ thi công và nhận thông báo theo thời gian thực.

## ✨ Tính năng

*   **Dashboard Trực quan**: Biểu đồ phân tích chi phí thực tế so với ngân sách.
*   **Quản lý Thu/Chi**: Theo dõi dòng tiền chi tiết theo hạng mục (Vật tư, Nhân công...) và giai đoạn (Móng, Thân...).
*   **Tương tác 2 chiều**: Tự động gửi thông báo qua Telegram khi có giao dịch mới.
*   **Cơ sở dữ liệu đám mây**: Lưu trữ dữ liệu an toàn trên MongoDB Atlas.

## 🚀 Công nghệ sử dụng

*   **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Recharts, SWR.
*   **Backend**: Next.js API Routes (Serverless).
*   **Database**: MongoDB (Mongoose ODM).
*   **Thông báo**: Telegram Bot API.

## 📂 Cấu trúc dự án
```
/
├── index.html      # Tệp HTML chính
├── data.js         # Chứa toàn bộ dữ liệu của dự án
├── script.js       # Toàn bộ mã JavaScript của ứng dụng
└── README.md       # Tệp tài liệu này
```

## 🛠️ Cách sử dụng

Chỉ cần mở tệp `index.html` trong trình duyệt web của bạn để xem và tương tác với trang tổng quan. Không cần cài đặt hay máy chủ.
