import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import TransactionForm from '@/components/TransactionForm';
import { format } from 'date-fns';

// Hàm lấy dữ liệu chạy trực tiếp trên Server (không cần API)
async function getData() {
  await dbConnect();
  // lean() trả về plain JS object giúp hiệu năng tốt hơn
  const transactions = await Transaction.find({}).sort({ date: -1 }).limit(20).lean();
  return transactions;
}

export default async function Dashboard() {
  const transactions = await getData();

  // Tính toán thống kê nhanh
  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Form nhập liệu & Thống kê */}
        <div className="space-y-6">
          {/* Cards Thống kê */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-red-100">
              <div className="text-xs text-gray-500 uppercase font-semibold">Tổng Chi</div>
              <div className="text-xl font-bold text-red-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalExpense)}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
              <div className="text-xs text-gray-500 uppercase font-semibold">Tổng Thu</div>
              <div className="text-xl font-bold text-green-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalIncome)}
              </div>
            </div>
          </div>

          {/* Form Nhập liệu (Client Component) */}
          <TransactionForm />
        </div>

        {/* Cột phải: Danh sách giao dịch */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-gray-800">🕒 Giao dịch gần nhất</h2>
              <span className="text-xs text-gray-500">{transactions.length} bản ghi</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-500 bg-gray-50 font-medium">
                  <tr>
                    <th className="py-3 px-4">Ngày</th>
                    <th className="py-3 px-4">Nội dung</th>
                    <th className="py-3 px-4">Số tiền</th>
                    <th className="py-3 px-4 text-center">Loại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-blue-50 transition-colors">
                      <td className="py-3 px-4 text-gray-600">
                        {format(new Date(tx.date), 'dd/MM')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{tx.title}</div>
                        <div className="text-xs text-gray-400">{tx.category} • {tx.contractor}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {new Intl.NumberFormat('vi-VN').format(tx.amount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          tx.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {tx.type === 'INCOME' ? '+' : '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}