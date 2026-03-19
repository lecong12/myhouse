import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';
import { sendTransactionNotification } from '@/services/notificationService';

// GET: Lấy danh sách giao dịch
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 1000;

    const transactions = await Transaction.find({})
      .sort({ date: -1 })
      .limit(limit);

    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Tạo giao dịch mới
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate cơ bản
    if (!body.title || !body.amount) {
        return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const transaction = await Transaction.create(body);
    
    // Gửi thông báo Telegram (không await để không chặn response)
    sendTransactionNotification(transaction); 

    return NextResponse.json({ success: true, data: transaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}