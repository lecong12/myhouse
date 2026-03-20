import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['INCOME', 'EXPENSE'], default: 'EXPENSE' },
  category: String,
  phase: String,
  contractor: String,
  date: { type: Date, default: Date.now },
  notes: String,
  status: { type: String, default: 'PAID' },
  createdAt: { type: Date, default: Date.now },
});

// Ngăn lỗi OverwriteModelError khi hot reload trong Next.js
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

export default Transaction;