'use server';

import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { revalidatePath } from 'next/cache';

export async function createTransaction(formData) {
  try {
    await dbConnect();

    const rawData = {
      title: formData.get('title'),
      amount: Number(formData.get('amount')),
      type: formData.get('type'),
      category: formData.get('category'),
      phase: formData.get('phase'),
      contractor: formData.get('contractor'),
      date: formData.get('date') || new Date(),
      notes: formData.get('notes'),
    };

    await Transaction.create(rawData);

    // Quan trọng: Báo cho Next.js biết dữ liệu đã thay đổi để cập nhật lại giao diện ngay lập tức
    revalidatePath('/');
    
    return { success: true, message: 'Đã lưu giao dịch thành công!' };
  } catch (error) {
    console.error('Lỗi khi lưu:', error);
    return { success: false, message: 'Lỗi: ' + error.message };
  }
}