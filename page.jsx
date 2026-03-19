'use client';

import useSWR from 'swr';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function DashboardPage() {
  const { data, error, isLoading } = useSWR('/api/transactions', fetcher);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu dự án...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Lỗi kết nối máy chủ.</div>;

  // Xử lý dữ liệu cho Dashboard
  const transactions = data?.data || [];
  
  let summary = { 
    totalIncome: 0, 
    totalExpense: 0, 
    balance: 0, 
    expenseByCategory: {} 
  };

  transactions.forEach(trans => {
    if (trans.type === 'INCOME') {
        summary.totalIncome += trans.amount;
    } else if (trans.type === 'EXPENSE') {
        summary.totalExpense += trans.amount;
        // Group by Category
        summary.expenseByCategory[trans.category] = (summary.expenseByCategory[trans.category] || 0) + trans.amount;
    }
  });
  summary.balance = summary.totalIncome - summary.totalExpense;

  // Data for Chart
  const pieData = Object.keys(summary.expenseByCategory).map(key => ({
    name: key,
    value: summary.expenseByCategory[key]
  }));
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">MyHouse Dashboard</h1>
                <p className="text-gray-500">Quản lý xây dựng & Dòng tiền</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                + Giao dịch mới
            </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
                label="Tổng Ngân Sách (Thu)" 
                value={summary.totalIncome} 
                color="text-blue-600" 
            />
            <StatCard 
                label="Tổng Chi Thực Tế" 
                value={summary.totalExpense} 
                color="text-red-600" 
            />
            <StatCard 
                label="Số Dư Hiện Tại" 
                value={summary.balance} 
                color={summary.balance >= 0 ? "text-green-600" : "text-red-500"} 
            />
        </div>

        {/* Charts & Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">Phân Bổ Chi Phí</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%" cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            
            {/* Recent Transactions List (Placeholder) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                 <h3 className="font-semibold text-lg mb-4 text-gray-800">Giao dịch gần đây</h3>
                 <div className="text-gray-500 text-sm text-center py-10">
                    Danh sách sẽ hiển thị tại đây...
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{formatCurrency(value)}</p>
        </div>
    );
}