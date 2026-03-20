import connectDB from '../lib/mongodb';
import Transaction from '../models/Transaction';
import { addTransaction } from './actions';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  await connectDB();

  const rawData = await Transaction.find().sort({ date: -1 }).limit(20).lean();
  const transactions = JSON.parse(JSON.stringify(rawData));

  const rawTotals = await Transaction.aggregate([
    { $group: { _id: '$type', total: { $sum: '$amount' } } }
  ]);
  const totals = JSON.parse(JSON.stringify(rawTotals));

  const income = totals.find(t => t._id === 'INCOME')?.total || 0;
  const expense = totals.find(t => t._id === 'EXPENSE')?.total || 0;

  return (
    <div className='max-w-4xl mx-auto p-6 bg-slate-50 min-h-screen font-sans'>
      <h1 className='text-3xl font-black mb-8 text-slate-900 tracking-tight'>MY HOUSE 2026</h1>
      
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-10'>
        <div className='p-6 bg-white border rounded-3xl shadow-sm'>
          <p className='text-[10px] font-bold text-blue-500 uppercase mb-1'>V?n vào</p>
          <p className='text-2xl font-black'>{income.toLocaleString()}d</p>
        </div>
        <div className='p-6 bg-white border rounded-3xl shadow-sm'>
          <p className='text-[10px] font-bold text-red-500 uppercase mb-1'>Ðã chi</p>
          <p className='text-2xl font-black'>{expense.toLocaleString()}d</p>
        </div>
        <div className='p-6 bg-slate-900 text-white rounded-3xl shadow-xl'>
          <p className='text-[10px] font-bold text-slate-400 uppercase mb-1'>Còn l?i</p>
          <p className='text-2xl font-black'>{(income - expense).toLocaleString()}d</p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='bg-white p-6 rounded-3xl border shadow-sm h-fit'>
          <h2 className='font-bold mb-4'>Giao d?ch m?i</h2>
          <form action={addTransaction} className='space-y-4'>
            <input name='title' placeholder='N?i dung chi/thu' required className='w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 ring-blue-500' />
            <div className='flex gap-2'>
              <input name='amount' type='number' placeholder='S? ti?n' required className='flex-1 p-3 bg-slate-50 rounded-xl outline-none' />
              <select name='type' className='p-3 bg-slate-50 rounded-xl outline-none'>
                <option value='EXPENSE'>Chi</option>
                <option value='INCOME'>Thu</option>
              </select>
            </div>
            <button type='submit' className='w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg'>Luu d? li?u</button>
          </form>
        </div>

        <div className='space-y-3'>
          <h2 className='font-bold mb-4'>Giao d?ch g?n dây</h2>
          {transactions.map((t) => (
            <div key={t._id} className='flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm'>
              <span className='text-sm font-bold text-slate-700'>{t.title}</span>
              <span className={ont-black }>
                {t.type === 'EXPENSE' ? '-' : '+'}{Number(t.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
