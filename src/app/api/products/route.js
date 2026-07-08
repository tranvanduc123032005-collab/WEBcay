import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'

// Dữ liệu sản phẩm ban đầu (nhúng trực tiếp để hoạt động trên mọi hosting)
const initialProducts = [
  {
    name: "Cây Trầu Bà Lỗ (Monstera)",
    category: "Cây trong nhà",
    rating: "★★★★★",
    ratingValue: 5.0,
    ratingCount: 120,
    price: 25.00,
    image: "/images/product-1.jpg",
    description: "Cây Trầu Bà Lỗ, còn được gọi là cây Phô mai Thụy Sĩ, là một loại cây nhiệt đới trồng trong nhà phổ biến. Những chiếc lá to, bóng, hình trái tim của nó phát triển các lỗ đặc trưng khi trưởng thành, làm cho nó trở thành một món đồ trang trí tuyệt đẹp cho bất kỳ căn phòng nào."
  },
  {
    name: "Cây Lưỡi Hổ",
    category: "Cây trong nhà",
    rating: "★★★★★",
    ratingValue: 4.9,
    ratingCount: 85,
    price: 18.00,
    image: "/images/product-2.jpg",
    description: "Cây Lưỡi Hổ (Sansevieria), là một trong những loại cây trồng trong nhà cứng cáp nhất. Đặc trưng bởi những chiếc lá thẳng đứng như thanh kiếm, nó rất xuất sắc trong việc thanh lọc không khí và phát triển tốt dù ít được chăm sóc, làm cho nó trở nên hoàn hảo cho người mới bắt đầu."
  },
  {
    name: "Cây Bàng Singapore",
    category: "Cây ngoài trời",
    rating: "★★★★★",
    ratingValue: 4.8,
    ratingCount: 64,
    price: 35.00,
    image: "/images/product-3.jpg",
    description: "Với những chiếc lá lớn, hình vĩ cầm và dáng cây cao, thanh lịch, cây Bàng Singapore (Fiddle Leaf Fig) là một loài cây được yêu thích trong thiết kế. Nó ưa ánh sáng tự nhiên và tạo điểm nhấn ngay lập tức trong mọi thiết kế nội thất."
  },
  {
    name: "Cây Nha Đam",
    category: "Cây văn phòng",
    rating: "★★★★★",
    ratingValue: 4.7,
    ratingCount: 42,
    price: 15.00,
    image: "/images/product-4.jpg",
    description: "Nha Đam (Aloe Vera) là một loại cây mọng nước. Nổi tiếng với chất gel làm dịu bên trong lá thịt, nó không chỉ đẹp trên bàn làm việc mà còn vô cùng hữu ích cho những vết bỏng nhẹ và chăm sóc da."
  }
]

// Hàm kiểm tra và nạp dữ liệu sản phẩm ban đầu nếu DB trống
async function checkAndSeed() {
  try {
    const count = await Product.countDocuments()
    if (count === 0) {
      await Product.insertMany(initialProducts)
      console.log('🌱 Đã nạp dữ liệu sản phẩm ban đầu vào MongoDB!')
    }
  } catch (error) {
    console.error('⚠️ Không thể seed dữ liệu ban đầu:', error)
  }
}

export async function GET() {
  try {
    await dbConnect()
    await checkAndSeed()
    
    const dbProducts = await Product.find({}).sort({ createdAt: -1 })
    
    // Ánh xạ _id thành id để Client hoạt động bình thường không cần sửa code
    const products = dbProducts.map(p => {
      const obj = p.toObject()
      return {
        ...obj,
        id: obj._id.toString()
      }
    })
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('API GET Products Error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    const body = await request.json()
    
    const newDoc = await Product.create({
      name: body.name,
      category: body.category,
      price: parseFloat(body.price),
      ratingValue: parseFloat(body.ratingValue) || 5.0,
      ratingCount: parseInt(body.ratingCount) || 0,
      image: body.image,
      description: body.description || ''
    })
    
    const responseData = {
      ...newDoc.toObject(),
      id: newDoc._id.toString()
    }
    
    return NextResponse.json(responseData, { status: 201 })
  } catch (error) {
    console.error('API POST Product Error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    await dbConnect()
    const body = await request.json()
    const { id } = body
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }
    
    const updatedDoc = await Product.findByIdAndUpdate(
      id,
      {
        name: body.name,
        category: body.category,
        price: body.price !== undefined ? parseFloat(body.price) : undefined,
        ratingValue: body.ratingValue !== undefined ? parseFloat(body.ratingValue) : undefined,
        ratingCount: body.ratingCount !== undefined ? parseInt(body.ratingCount) : undefined,
        image: body.image,
        description: body.description
      },
      { new: true, runValidators: true }
    )
    
    if (!updatedDoc) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    const responseData = {
      ...updatedDoc.toObject(),
      id: updatedDoc._id.toString()
    }
    
    return NextResponse.json(responseData)
  } catch (error) {
    console.error('API PUT Product Error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }
    
    const deletedDoc = await Product.findByIdAndDelete(id)
    
    if (!deletedDoc) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('API DELETE Product Error:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
