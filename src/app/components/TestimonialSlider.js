'use client'

import { useState, useEffect, useCallback } from 'react'

const testimonials = [
  {
    stars: '★★★★★',
    quote: '"Tôi hoàn toàn hài lòng với những cây đã mua từ Oasis! Chúng đến nơi trong tình trạng tươi tốt và khỏe mạnh. Bao bì cẩn thận và thân thiện với môi trường. Rất đáng để giới thiệu cho bất kỳ ai muốn thêm không gian xanh!"',
    name: 'Sarah M.',
    role: 'Khách hàng vui vẻ',
    avatar: '/images/avatar-sarah.png',
  },
  {
    stars: '★★★★★',
    quote: '"Cây Monstera tôi mua đang phát triển rất tốt! Cây chất lượng tuyệt vời cùng dịch vụ khách hàng tuyệt hảo. Họ còn gửi kèm thẻ hướng dẫn chăm sóc. Chắc chắn tôi sẽ đặt thêm cây sớm thôi!"',
    name: 'James K.',
    role: 'Người đam mê cây',
    avatar: '/images/avatar-james.png',
  },
  {
    stars: '★★★★☆',
    quote: '"Sự lựa chọn cây tuyệt đẹp! Không gian văn phòng của tôi trông sống động hơn nhiều. Giao hàng nhanh và cây được đóng gói rất cẩn thận. Lý do duy nhất không được 5 sao là tôi ước họ có nhiều loại sen đá hơn!"',
    name: 'Emily T.',
    role: 'Nhà thiết kế nội thất',
    avatar: '/images/avatar-emily.png',
  },
]

export default function TestimonialSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isSliding, setIsSliding] = useState(false)

  const goToSlide = useCallback((index) => {
    if (isSliding) return
    setIsSliding(true)
    setCurrentSlide((index + testimonials.length) % testimonials.length)
    setTimeout(() => setIsSliding(false), 500)
  }, [isSliding])

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1)
  }, [currentSlide, goToSlide])

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <section className="testimonial" id="testimonial">
      <div className="container">
        <div className="testimonial-content">
          <span className="section-label">Đánh giá</span>
          <h2 className="section-title">Khách hàng nói gì về chúng tôi</h2>

          {/* Slider Container */}
          <div className="testimonial-slider">
            <div className="slider-track">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className={`testimonial-card slide ${i === currentSlide ? 'active-slide' : ''}`}
                >
                  <div className="stars">{t.stars}</div>
                  <p className="quote">{t.quote}</p>
                  <div className="testimonial-author">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.avatar} alt={t.name} className="avatar" loading="lazy" />
                    <div>
                      <h4>{t.name}</h4>
                      <span>{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Navigation */}
            <div className="slider-nav">
              <button className="slider-btn slider-prev" aria-label="Previous testimonial" onClick={() => goToSlide(currentSlide - 1)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="testimonial-dots">
                {testimonials.map((_, i) => (
                  <span
                    key={i}
                    className={`dot ${i === currentSlide ? 'active' : ''}`}
                    onClick={() => goToSlide(i)}
                  />
                ))}
              </div>
              <button className="slider-btn slider-next" aria-label="Next testimonial" onClick={() => goToSlide(currentSlide + 1)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
