import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }
    
    // Đọc file thành buffer rồi chuyển sang base64 data URL
    // Cách này hoạt động trên mọi hosting (Render, Vercel, etc.) vì không cần ghi file vào ổ đĩa
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Lấy mime type từ file
    const mimeType = file.type || 'image/jpeg'
    
    // Chuyển thành base64 data URL
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${mimeType};base64,${base64}`
    
    return NextResponse.json({ url: dataUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
