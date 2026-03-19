import './globals.css';

export const metadata = {
  title: 'MyHouse - Quản lý Xây dựng',
  description: 'Hệ thống theo dõi tiến độ và tài chính xây nhà',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="bg-gray-50 min-h-screen text-slate-900 antialiased">
        <main>
            {children}
        </main>
      </body>
    </html>
  );
}