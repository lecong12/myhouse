import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { revalidatePath } from 'next/cache';

// KHÔNG CHO PHÉP RENDER TĨNH LÚC BUILD
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  await connectDB();

  // 1. Lấy dữ liệu và ép kiểu thô bạo để Next.js không thể bắt bẻ
  const rawTransactions = await Transaction.find()
    .sort({ date: -1 })
    .limit(10)
    .lean();

  const transactions = JSON.parse(JSON.stringify(rawTransactions));

  // 2. Tính toán tổng số
  const rawTotals = await Transaction.aggregate([
    { $group: { _id: "$type", total: { $sum: "$amount" } } }
  ]);
  const totals = JSON.parse(JSON.stringify(rawTotals));

  const income = totals.find(t => t._id === 'INCOME')?.total || 0;
  const expense = totals.find(t => t._id === 'EXPENSE')?.total || 0;

  // SERVER ACTION PHẢI ĐỊNH NGHĨA TRONG COMPONENT HOẶC FILE RIÊNG
  async function addTransaction(formData) {
    'use server';
    await connectDB();
    const data = {
      title: formData.get('title'),
      amount: Number(formData.get('amount')),
      type: formData.get('type'),
      category: "Khác",
      date: new Date(),
    };
    await Transaction.create(data);
    revalidatePath('/');
  }

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold mb-6">🏠 MyHouse Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-blue-50 border rounded-xl">
          <p className="text-sm">Tổng Vốn</p>
          <p className="text-xl font-bold text-blue-600">{income.toLocaleString()}đ</p>
        </div>
        <div className="p-4 bg-red-50 border rounded-xl">
          <p className="text-sm">Đã Chi</p>
          <p className="text-xl font-bold text-red-600">{expense.toLocaleString()}đ</p>
        </div>
        <div className="p-4 bg-green-50 border rounded-xl">
          <p className="text-sm">Còn Lại</p>
          <p className="text-xl font-bold text-green-600">{(income - expense).toLocaleString()}đ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Nhập Liệu */}
        <div className="p-6 bg-white border rounded-2xl shadow-sm h-fit">
          <h2 className="font-semibold mb-4">Thêm giao dịch</h2>
          <form action={addTransaction} className="space-y-4">
            <input name="title" placeholder="Nội dung" required className="w-full p-2 border rounded" />
            <input name="amount" type="number" placeholder="Số tiền" required className="w-full p-2 border rounded" />
            <select name="type" className="w-full p-2 border rounded bg-gray-50">
              <option value="EXPENSE">Chi ra</option>
              <option value="INCOME">Thu vào</option>
            </select>
            <button type="submit" className="w-full bg-slate-800 text-white p-2 rounded font-bold hover:bg-slate-700">Lưu</button>
          </form>
        </div>

        {/* Danh sách */}
        <div>
          <h2 className="font-semibold mb-4">Lịch sử mới nhất</h2>
          <div className="space-y-2">
            {transactions.map((t) => (
              <div key={t._id} className="flex justify-between p-3 bg-gray-50 border rounded-lg">
                <span className="text-sm font-medium text-slate-700">{t.title}</span>
                <span className={`font-bold ${t.type === 'EXPENSE' ? 'text-red-500' : 'text-green-600'}`}>
                  {t.type === 'EXPENSE' ? '-' : '+'}{Number(t.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}