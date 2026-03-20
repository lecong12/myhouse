'use client';

import { useRef, useState } from 'react';
import { createTransaction } from '@/app/actions';

export default function TransactionForm() {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit(formData) {
    setLoading(true);
    setMessage(null);
    
    const result = await createTransaction(formData);
    
    if (result.success) {
      formRef.current?.reset(); // Xóa trắng form sau khi lưu
      setMessage({ type: 'success', text: result.message });
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📝 Nhập Giao Dịch Mới</h2>
      
      {message && (
        <div className={`p-3 rounded-lg mb-4 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <select name="type" className="p-2 border rounded-lg w-full bg-gray-50">
            <option value="EXPENSE">🔴 Chi phí</option>
            <option value="INCOME">🟢 Thu nhập</option>
          </select>
          <input 
            type="date" 
            name="date" 
            defaultValue={new Date().toISOString().split('T')[0]}
            className="p-2 border rounded-lg w-full" 
          />
        </div>

        <div>
          <input 
            type="text" 
            name="title" 
            required 
            placeholder="Nội dung chi tiêu (vd: Cát, Xi măng...)" 
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input 
            type="number" 
            name="amount" 
            required 
            min="0"
            placeholder="Số tiền (VNĐ)" 
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
          />
          <select name="category" className="w-full p-2 border rounded-lg">
            <option value="Vật tư">🧱 Vật tư</option>
            <option value="Nhân công">👷 Nhân công</option>
            <option value="Máy móc">🚜 Máy móc</option>
            <option value="Nội thất">🪑 Nội thất</option>
            <option value="Khác">📦 Khác</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select name="phase" className="w-full p-2 border rounded-lg">
            <option value="Móng">Móng & Ngầm</option>
            <option value="Thân">Phần Thân</option>
            <option value="Hoàn thiện">Hoàn thiện</option>
          </select>
          <input 
            type="text" 
            name="contractor" 
            placeholder="Đơn vị cung cấp..." 
            className="w-full p-2 border rounded-lg" 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all disabled:bg-blue-300"
        >
          {loading ? 'Đang lưu...' : 'Lưu Giao Dịch'}
        </button>
      </form>
    </div>
  );
}