import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Quản Lý</h1>
      <p className="mb-4">Chào mừng bạn đến với trang quản lý xây dựng.</p>
      <Link href="/" className="text-blue-600 hover:underline">
        ← Quay lại thêm giao dịch
      </Link>
    </div>
  );
}