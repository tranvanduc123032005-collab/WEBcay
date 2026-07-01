import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'
import fs from 'fs/promises'
import path from 'path'

// Hàm kiểm tra và nạp dữ liệu sản phẩm ban đầu từ products.json nếu DB trống
async function checkAndSeed() {
  try {
    const count = await Product.countDocuments()
    if (count === 0) {
      const jsonPath = path.join(process.cwd(), 'src', 'data', 'products.json')
      const fileData = await fs.readFile(jsonPath, 'utf8')
      const initialProducts = JSON.parse(fileData)
      
      // Loại bỏ thuộc tính id cứng của client để MongoDB tự sinh _id mới
      const seededData = initialProducts.map(({ id, ...rest }) => rest)
      
      await Product.insertMany(seededData)
      console.log('🌱 Đã nạp dữ liệu sản phẩm ban đầu từ JSON vào MongoDB!')
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
