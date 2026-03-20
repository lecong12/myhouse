import connectDB from '../lib/mongodb';
import Transaction from '../models/Transaction';
import { addTransaction } from './actions';

// --- LỆNH LOẠI BỎ TẠO TRANG TĨNH ---
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default async function HomePage() {
  let transactions = [];
  let income = 0;
  let expense = 0;

  try {
    await connectDB();

    // Lấy dữ liệu và TẨY TỦY (Sanitize) 100% sang JSON thuần
    const rawData = await Transaction.find().sort({ date: -1 }).limit(20).lean();
    transactions = JSON.parse(JSON.stringify(rawData));

    // Tương tự với phần Aggregate
    const rawTotals = await Transaction.aggregate([
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);
    const totals = JSON.parse(JSON.stringify(rawTotals));

    income = totals.find(t => t._id === 'INCOME')?.total || 0;
    expense = totals.find(t => t._id === 'EXPENSE')?.total || 0;
  } catch (error) {
    console.error("Build-time data fetch skipped or failed:", error);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-slate-50">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 uppercase italic">My House 2026</h1>
        <p className="text-slate-500 font-bold text-xs tracking-widest">REAL-TIME FINANCIAL TRACKING</p>
      </header>

      {/* Dashboard hiển thị số tiền */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="p-6 bg-white border-b-4 border-blue-500 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase">Vốn vào</p>
          <p className="text-2xl font-black text-blue-600">{income.toLocaleString()}đ</p>
        </div>
        <div className="p-6 bg-white border-b-4 border-red-500 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase">Đã chi</p>
          <p className="text-2xl font-black text-red-600">{expense.toLocaleString()}đ</p>
        </div>
        <div className="p-6 bg-slate-900 rounded-2xl shadow-xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase">Còn lại</p>
          <p className="text-2xl font-black text-white">{(income - expense).toLocaleString()}đ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form nhập liệu dùng Server Action */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="font-bold text-slate-800 mb-4">Giao dịch mới</h2>
          <form action={addTransaction} className="space-y-4">
            <input name="title" placeholder="Mục chi tiêu/thu" required className="w-full p-3 bg-slate-50 rounded-xl outline-none border-2 border-transparent focus:border-blue-400 transition-all" />
            <div className="flex gap-2">
              <input name="amount" type="number" placeholder="Số tiền" required className="flex-1 p-3 bg-slate-50 rounded-xl outline-none border-2 border-transparent focus:border-blue-400" />
              <select name="type" className="p-3 bg-slate-50 rounded-xl border-none outline-none">
                <option value="EXPENSE">Chi</option>
                <option value="INCOME">Thu</option>
              </select>
            </div>
            <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 active:scale-95 transition-all">
              LƯU DỮ LIỆU
            </button>
          </form>
        </div>

        {/* Danh sách hiển thị */}
        <div className="space-y-3">
          <h2 className="font-bold text-slate-800 mb-4">Lịch sử giao dịch</h2>
          {transactions.map((t) => (
            <div key={t._id} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-sm font-bold text-slate-700">{t.title}</span>
              <span className={`font-black ${t.type === 'EXPENSE' ? 'text-red-500' : 'text-green-600'}`}>
                {t.type === 'EXPENSE' ? '-' : '+'}{Number(t.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
