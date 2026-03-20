'use server';

import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { revalidatePath } from 'next/cache';

export async function addTransaction(formData) {
  await dbConnect();
  
  const data = {
    title: formData.get('title'),
    amount: Number(formData.get('amount')),
    type: formData.get('type'),
    category: "Xây dựng", // Có thể mở rộng sau
    date: new Date(),
  };

  await Transaction.create(data);
  
  // Yêu cầu Next.js làm mới dữ liệu trên trang chủ
  revalidatePath('/');
}