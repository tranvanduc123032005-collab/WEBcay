import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng điền tên sản phẩm'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Vui lòng chọn danh mục'],
    enum: ['Indoor Plants', 'Outdoor Plants', 'Office Plants'],
    default: 'Indoor Plants'
  },
  rating: {
    type: String,
    default: '★★★★★'
  },
  ratingValue: {
    type: Number,
    default: 5.0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Vui lòng nhập giá sản phẩm'],
    min: [0, 'Giá tiền không thể âm']
  },
  image: {
    type: String,
    required: [true, 'Vui lòng tải lên hình ảnh sản phẩm']
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // Tự động tạo createdAt và updatedAt
})

// Đảm bảo không tạo lại model khi Next.js reload compile code
export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
