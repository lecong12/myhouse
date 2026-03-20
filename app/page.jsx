import connectDB from '../lib/mongodb';         // Lùi 1 cấp ra khỏi app/ để vào lib/
import Transaction from '../models/Transaction'; // Lùi 1 cấp ra khỏi app/ để vào models/
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
      category: "Nâng cấp",
      date: new Date(),
    };
    await Transaction.create(data);
    revalidatePath('/');
  }

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <header className="mb-10 border-b pb-6">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">MY HOUSE 2026</h1>
        <p className="text-slate-500 font-medium">Hệ thống quản lý tài chính xây dựng thông minh</p>
      </header>
      
      {/* Chỉ số Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-white border-2 border-blue-100 rounded-3xl shadow-sm">
          <p className="text-xs font-bold uppercase text-blue-500 tracking-widest mb-1">Tổng Vốn</p>
          <p className="text-3xl font-black text-slate-800">{income.toLocaleString()} <span className="text-sm font-normal text-slate-400">đ</span></p>
        </div>
        <div className="p-6 bg-white border-2 border-red-100 rounded-3xl shadow-sm">
          <p className="text-xs font-bold uppercase text-red-500 tracking-widest mb-1">Đã Chi</p>
          <p className="text-3xl font-black text-slate-800">{expense.toLocaleString()} <span className="text-sm font-normal text-slate-400">đ</span></p>
        </div>
        <div className="p-6 bg-slate-900 rounded-3xl shadow-xl shadow-slate-200">
          <p className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-1">Còn Lại</p>
          <p className="text-3xl font-black text-white">{(income - expense).toLocaleString()} <span className="text-sm font-normal text-slate-500">đ</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form Nhập Liệu */}
        <section className="bg-white p-8 rounded-3xl border shadow-sm border-slate-100 h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
            Nhập giao dịch
          </h2>
          <form action={addTransaction} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Nội dung chi tiết</label>
              <input name="title" placeholder="Ví dụ: Mua gạch lát nền" required className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 ring-blue-500 transition-all outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Số tiền</label>
                <input name="amount" type="number" placeholder="0" required className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Loại</label>
                <select name="type" className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 ring-blue-500 outline-none appearance-none">
                  <option value="EXPENSE">Chi ra</option>
                  <option value="INCOME">Thu vào</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-200">
              Lưu dữ liệu
            </button>
          </form>
        </section>

        {/* Danh sách */}
        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-slate-800 rounded-full"></span>
            Giao dịch mới nhất
          </h2>
          <div className="space-y-3">
            {transactions.map((t) => (
              <div key={t._id} className="group flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-colors shadow-sm">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700">{t.title}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{new Date(t.date).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className={`text-lg font-black ${t.type === 'EXPENSE' ? 'text-red-500' : 'text-green-500'}`}>
                  {t.type === 'EXPENSE' ? '-' : '+'}{Number(t.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}