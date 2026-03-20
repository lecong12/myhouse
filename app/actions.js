'use server'

import connectDB from '../lib/mongodb';
import Transaction from '../models/Transaction';
import { revalidatePath } from 'next/cache';

export async function addTransaction(formData) {
  try {
    await connectDB();
    const data = {
      title: formData.get('title'),
      amount: Number(formData.get('amount')),
      type: formData.get('type'),
      category: "Xây dựng",
      date: new Date(),
    };
    await Transaction.create(data);
    revalidatePath('/'); // Làm mới dữ liệu trang chủ sau khi thêm
  } catch (error) {
    console.error("Lỗi Action:", error);
  }
}