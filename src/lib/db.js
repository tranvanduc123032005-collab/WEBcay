import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

/**
  * Trong quá trình phát triển (development), sử dụng biến toàn cục (global)
  * để lưu giữ kết nối MongoDB qua các lượt Hot Reload.
  * Giúp tránh việc rò rỉ hoặc quá tải số lượng kết nối tới CSDL.
  */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('🌿 Đã kết nối thành công tới MongoDB!')
      return mongooseInstance
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('❌ Lỗi kết nối CSDL MongoDB:', e)
    throw e
  }

  return cached.conn
}

export default dbConnect
