import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import mongoose from 'mongoose';

// Định nghĩa Schema ngay tại đây cho đơn giản (hoặc tách ra file models riêng)
const TransactionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['INCOME', 'EXPENSE'], default: 'EXPENSE' },
  category: String,
  phase: String,
  contractor: String,
  date: Date,
  notes: String,
  status: { type: String, default: 'PAID' },
  createdAt: { type: Date, default: Date.now },
});

// Ngăn lỗi OverwriteModelError khi hot reload
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const transaction = await Transaction.create(body);

    return NextResponse.json({ success: true, data: transaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET() {
  await dbConnect();
  const transactions = await Transaction.find({}).sort({ date: -1 });
  return NextResponse.json({ success: true, data: transactions });
}