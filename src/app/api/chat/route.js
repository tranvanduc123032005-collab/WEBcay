import { NextResponse } from 'next/server'

const SYSTEM_PROMPT = `Bạn là trợ lý AI tư vấn cây cảnh của cửa hàng "ĐỨC NGƯỜI CÂY" (OASIS Plant Shop). 
Nhiệm vụ của bạn:
- Tư vấn chọn cây cảnh phù hợp với không gian (trong nhà, ngoài trời, văn phòng).
- Hướng dẫn chăm sóc cây (tưới nước, ánh sáng, phân bón).
- Giới thiệu các sản phẩm của cửa hàng: Monstera Deliciosa ($25), Snake Plant ($18), Fiddle Leaf Fig ($35), Aloe Vera ($15).
- Trả lời bằng tiếng Việt, thân thiện, ngắn gọn, dễ hiểu.
- Nếu khách hỏi ngoài chủ đề cây cảnh, hãy nhẹ nhàng dẫn dắt về chủ đề cây cảnh.
- Luôn kết thúc bằng câu hỏi gợi mở để tiếp tục cuộc trò chuyện.`

// Câu trả lời dự phòng khi không có API key hợp lệ
const FALLBACK_RESPONSES = {
  greeting: 'Xin chào! 🌿 Chào mừng bạn đến với cửa hàng ĐỨC NGƯỜI CÂY! Hiện tại chúng tôi có 4 loại cây hot: Monstera ($25), Snake Plant ($18), Fiddle Leaf Fig ($35) và Aloe Vera ($15). Bạn quan tâm đến loại cây nào?',
  monstera: '🌿 Monstera Deliciosa - Giá $25\nĐây là loại cây rất đẹp với lá xẻ thuỳ độc đáo. Phù hợp đặt trong nhà, cần ánh sáng gián tiếp, tưới 1-2 lần/tuần. Cây này rất dễ chăm sóc và phát triển nhanh! Bạn muốn đặt mua không?',
  snake: '🌿 Snake Plant (Lưỡi hổ) - Giá $18\nCây lọc không khí tuyệt vời, cực kỳ dễ chăm sóc! Chịu được điều kiện ánh sáng yếu, chỉ cần tưới 2 tuần/lần. Phù hợp cho văn phòng và phòng ngủ. Bạn muốn tìm hiểu thêm không?',
  fiddle: '🌿 Fiddle Leaf Fig - Giá $35\nCây sung đàn rất đẹp và sang trọng. Cần ánh sáng sáng gián tiếp, tưới khi đất khô. Đây là loại cây trang trí nội thất rất phổ biến! Bạn có muốn xem chi tiết không?',
  aloe: '🌿 Aloe Vera (Nha đam) - Giá $15\nNgoài việc đẹp, nha đam còn có nhiều công dụng cho sức khỏe và làm đẹp! Cực kỳ dễ chăm sóc, chỉ cần tưới 2-3 tuần/lần, thích ánh sáng trực tiếp. Bạn quan tâm không?',
  care: '🌿 Để chăm sóc cây tốt, bạn cần lưu ý:\n1. Tưới nước đúng lượng - không quá nhiều\n2. Đặt nơi có ánh sáng phù hợp\n3. Bón phân định kỳ 1 tháng/lần\n4. Thay chậu khi cây lớn\nBạn đang chăm sóc loại cây nào?',
  default: '🌿 Cảm ơn bạn đã liên hệ! Cửa hàng chúng tôi có nhiều loại cây đẹp:\n\n• Monstera Deliciosa - $25\n• Snake Plant - $18\n• Fiddle Leaf Fig - $35\n• Aloe Vera - $15\n\nBạn muốn tìm hiểu về loại cây nào? Hoặc cho tôi biết không gian bạn muốn đặt cây (phòng khách, phòng ngủ, văn phòng...) để tôi tư vấn phù hợp nhé! 🪴',
}

function getFallbackResponse(message) {
  const msg = message.toLowerCase()
  if (msg.includes('xin chào') || msg.includes('hello') || msg.includes('hi') || msg.includes('chào')) {
    return FALLBACK_RESPONSES.greeting
  }
  if (msg.includes('monstera')) return FALLBACK_RESPONSES.monstera
  if (msg.includes('snake') || msg.includes('lưỡi hổ')) return FALLBACK_RESPONSES.snake
  if (msg.includes('fiddle') || msg.includes('sung')) return FALLBACK_RESPONSES.fiddle
  if (msg.includes('aloe') || msg.includes('nha đam')) return FALLBACK_RESPONSES.aloe
  if (msg.includes('chăm sóc') || msg.includes('tưới') || msg.includes('care') || msg.includes('ánh sáng')) {
    return FALLBACK_RESPONSES.care
  }
  return FALLBACK_RESPONSES.default
}

export async function POST(request) {
  let userMessage = ''
  
  try {
    const { message, history } = await request.json()
    userMessage = message || ''

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Kiểm tra API key
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey.length < 10 || !apiKey.startsWith('AIza')) {
      // API key không hợp lệ → dùng fallback responses
      console.warn('Gemini API Key không hợp lệ hoặc chưa được cấu hình. Sử dụng chế độ trả lời tự động.')
      const reply = getFallbackResponse(message)
      return NextResponse.json({ reply })
    }

    // Sử dụng Gemini API nếu API key hợp lệ
    const { GoogleGenAI } = await import('@google/genai')
    const ai = new GoogleGenAI({ apiKey })

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
    console.error('Chat API Error:', error?.message || error)
    
    // Dùng fallback response với message đã lưu từ trước
    const reply = getFallbackResponse(userMessage)
    return NextResponse.json({ reply })
  }
}
