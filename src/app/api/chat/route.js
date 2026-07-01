import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const SYSTEM_PROMPT = `Bạn là trợ lý AI tư vấn cây cảnh của cửa hàng "ĐỨC NGƯỜI CÂY" (OASIS Plant Shop). 
Nhiệm vụ của bạn:
- Tư vấn chọn cây cảnh phù hợp với không gian (trong nhà, ngoài trời, văn phòng).
- Hướng dẫn chăm sóc cây (tưới nước, ánh sáng, phân bón).
- Giới thiệu các sản phẩm của cửa hàng: Monstera Deliciosa ($25), Snake Plant ($18), Fiddle Leaf Fig ($35), Aloe Vera ($15).
- Trả lời bằng tiếng Việt, thân thiện, ngắn gọn, dễ hiểu.
- Nếu khách hỏi ngoài chủ đề cây cảnh, hãy nhẹ nhàng dẫn dắt về chủ đề cây cảnh.
- Luôn kết thúc bằng câu hỏi gợi mở để tiếp tục cuộc trò chuyện.`

export async function POST(request) {
  try {
    const { message, history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Xây dựng nội dung hội thoại
    const contents = []

    // Thêm lịch sử hội thoại
    if (history && history.length > 0) {
      for (const msg of history) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })
      }
    }

    // Thêm tin nhắn mới
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    })

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 500,
        temperature: 0.7,
      }
    })

    const reply = response.text || 'Xin lỗi, tôi không thể trả lời lúc này. Vui lòng thử lại!'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Gemini API Error:', error)
    return NextResponse.json({
      reply: 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau ít phút! 🌿'
    })
  }
}
