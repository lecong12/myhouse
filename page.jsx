'use client';

import Link from 'next/link';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const { data, error, isLoading } = useSWR('/api/transactions', fetcher);

  if (isLoading) return <div className="p-8 text-center text-gray-500">⏳ Đang tải dữ liệu...</div>;
  if (error) return <div className="p-8 text-center text-red-500">❌ Lỗi kết nối đến máy chủ.</div>;

  const transactions = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">📊 Lịch Sử Giao Dịch</h1>
          <Link 
            href="/" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <span>+</span> Thêm Mới
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Ngày</th>
                  <th className="py-3 px-4">Nội dung</th>
                  <th className="py-3 px-4">Danh mục</th>
                  <th className="py-3 px-4">Số tiền</th>
                  <th className="py-3 px-4 text-center">Loại</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      Chưa có giao dịch nào được ghi nhận.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {tx.title}
                        {tx.contractor && <div className="text-xs text-gray-400 font-normal">{tx.contractor}</div>}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        <span className="inline-block bg-gray-100 rounded px-2 py-1 text-xs">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tx.amount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tx.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {tx.type === 'INCOME' ? 'Thu' : 'Chi'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}