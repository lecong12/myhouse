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
      category: 'Xây dựng',
      date: new Date(),
    };
    await Transaction.create(data);
    revalidatePath('/');
  } catch (error) {
    console.error('Lỗi Action:', error);
  }
}
