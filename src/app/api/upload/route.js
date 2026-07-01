import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Đảm bảo thư mục public/uploads tồn tại
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    try {
      await fs.access(uploadDir)
    } catch {
      await fs.mkdir(uploadDir, { recursive: true })
    }
    
    // Tạo tên file độc nhất để tránh trùng lặp
    const ext = path.extname(file.name) || '.jpg'
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, '_')
    const fileName = `${baseName}_${Date.now()}${ext}`
    const filePath = path.join(uploadDir, fileName)
    
    // Ghi file xuống ổ đĩa
    await fs.writeFile(filePath, buffer)
    
    // Trả về URL tương đối để hiển thị trực tiếp ở client
    const fileUrl = `/uploads/${fileName}`
    return NextResponse.json({ url: fileUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
