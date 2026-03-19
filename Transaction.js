import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, // VD: Xi măng Hà Tiên
  amount: { type: Number, required: true },            // Số tiền (VND)
  type: { type: String, enum: ['INCOME', 'EXPENSE'], required: true }, // Thu/Chi
  
  // Phân loại chuyên sâu
  category: { type: String, required: true },         // VD: Vật tư, Nhân công
  phase: { type: String, required: true },            // VD: Móng, Thân, Hoàn thiện
  contractor: { type: String, trim: true },           // Đơn vị cung cấp
  
  date: { type: Date, default: Date.now, required: true },
  receiptUrl: { type: String, default: null },        // Link ảnh hóa đơn
  notes: String,
  
  // Quản lý trạng thái
  status: { 
    type: String, 
    enum: ['PAID', 'PENDING', 'CANCELLED'], 
    default: 'PAID' 
  },
  createdBy: { type: String, default: 'Admin' },      
  updatedAt: { type: Date, default: Date.now },
});

// Prevent recompilation error in Next.js
export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);