import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Cache connection để tránh tạo quá nhiều kết nối khi hot-reload
let cached = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error('Vui lòng định nghĩa biến MONGODB_URI trong file .env.local');
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;