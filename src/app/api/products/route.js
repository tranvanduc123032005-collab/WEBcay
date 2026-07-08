import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'

// Dữ liệu sản phẩm ban đầu (nhúng trực tiếp để hoạt động trên mọi hosting)
const initialProducts = [
  {
    name: "Monstera Deliciosa",
    category: "Indoor Plants",
    rating: "★★★★★",
    ratingValue: 5.0,
    ratingCount: 120,
    price: 25.00,
    image: "/images/product-1.jpg",
    description: "The Monstera Deliciosa, also known as the Swiss Cheese Plant, is a popular tropical houseplant. Its large, glossy, heart-shaped leaves develop distinctive holes as they mature, making it a stunning decorative piece for any room."
  },
  {
    name: "Snake Plant",
    category: "Indoor Plants",
    rating: "★★★★★",
    ratingValue: 4.9,
    ratingCount: 85,
    price: 18.00,
    image: "/images/product-2.jpg",
    description: "The Snake Plant, or Sansevieria, is one of the hardiest house plants. Characterized by its upright sword-like leaves, it is excellent at purifying air and thrives on neglect, making it perfect for beginners."
  },
  {
    name: "Fiddle Leaf Fig",
    category: "Outdoor Plants",
    rating: "★★★★★",
    ratingValue: 4.8,
    ratingCount: 64,
    price: 35.00,
    image: "/images/product-3.jpg",
    description: "With its large, violin-shaped leaves and tall, elegant stature, the Fiddle Leaf Fig is a design favourite. It loves bright, indirect light and creates an instant focal point in any interior design."
  },
  {
    name: "Aloe Vera",
    category: "Office Plants",
    rating: "★★★★★",
    ratingValue: 4.7,
    ratingCount: 42,
    price: 15.00,
    image: "/images/product-4.jpg",
    description: "Aloe Vera is a succulent plant species of the genus Aloe. Known for its soothing gel inside fleshy leaves, it's not only beautiful on office desks but also incredibly useful for minor burns and skin care."
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
