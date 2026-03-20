import connectDB from '../lib/mongodb';
import Transaction from '../models/Transaction';
import { revalidatePath } from 'next/cache';

// CHIẾN THUẬT 1: Chuyển trang sang chế độ Dynamic hoàn toàn
// Điều này giúp bỏ qua bước "Generating static pages" đang bị lỗi của bạn.
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function HomePage() {
  await connectDB();

  // CHIẾN THUẬT 2: Lấy dữ liệu và ép kiểu thô bạo (Sanitize)
  // Dùng .lean() để lấy Plain Object, sau đó dùng JSON để lọc sạch methods
  const rawTransactions = await Transaction.find()
    .sort({ date: -1 })
    .limit(20)
    .lean();

  const transactions = JSON.parse(JSON.stringify(rawTransactions));

  // Tính toán tổng số (đã lọc sạch)
  const rawTotals = await Transaction.aggregate([
    { $group: { _id: "$type", total: { $sum: "$amount" } } }
  ]);
  const totals = JSON.parse(JSON.stringify(rawTotals));

  const income = totals.find(t => t._id === 'INCOME')?.total || 0;
  const expense = totals.find(t => t._id === 'EXPENSE')?.total || 0;

  // Server Action: Định nghĩa trực tiếp bên trong Server Component
  async function addTransaction(formData) {
    'use server';
    try {
      await connectDB();
      const data = {
        title: formData.get('title'),
        amount: Number(formData.get('amount')),
        type: formData.get('type'),
        category: "Chung",
        date: new Date(),
      };
      await Transaction.create(data);
      revalidatePath('/');
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 font-sans bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">MY HOUSE 2026</h1>
        <p className="text-slate-500 font-medium text-sm">Quản lý dòng tiền xây dựng</p>
      </header>
      
      {/* Dashboard Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="p-6 bg-white rounded-3xl border border-blue-100 shadow-sm">
          <p className="text-[10px] font-black uppercase text-blue-500 tracking-wider mb-2">Tổng Thu</p>
          <p className="text-2xl font-black text-slate-800">{income.toLocaleString()}đ</p>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-red-100 shadow-sm">
          <p className="text-[10px] font-black uppercase text-red-500 tracking-wider mb-2">Đã Chi</p>
          <p className="text-2xl font-black text-slate-800">{expense.toLocaleString()}đ</p>
        </div>
        <div className="p-6 bg-slate-900 rounded-3xl shadow-xl">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Số Dư</p>
          <p className="text-2xl font-black text-white">{(income - expense).toLocaleString()}đ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cột Trái: Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold mb-5 text-slate-800">Thêm Giao Dịch</h2>
          <form action={addTransaction} className="space-y-4">
            <input name="title" placeholder="Tên khoản chi/thu" required 
              className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 ring-blue-500 transition-all" />
            <div className="flex gap-3">
              <input name="amount" type="number" placeholder="Số tiền" required 
                className="flex-1 p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 ring-blue-500 transition-all" />
              <select name="type" className="p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 ring-blue-500">
                <option value="EXPENSE">Chi</option>
                <option value="INCOME">Thu</option>
              </select>
            </div>
            <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
              Lưu Giao Dịch
            </button>
          </form>
        </div>

        {/* Cột Phải: Lịch sử */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800 px-2">Lịch Sử Gần Đây</h2>
          {transactions.map((t) => (
            <div key={t._id} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-200 transition-all">
              <div>
                <p className="font-bold text-slate-700 text-sm">{t.title}</p>
                <p className="text-[10px] text-slate-400 font-medium">{new Date(t.date).toLocaleDateString('vi-VN')}</p>
              </div>
              <p className={`font-black ${t.type === 'EXPENSE' ? 'text-red-500' : 'text-green-500'}`}>
                {t.type === 'EXPENSE' ? '-' : '+'}{Number(t.amount).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}