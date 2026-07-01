'use client'

import { useState, useEffect, useCallback } from 'react'

const testimonials = [
  {
    stars: '★★★★★',
    quote: '"I absolutely love the plants I ordered from Oasis! They arrived fresh and healthy. The packaging was careful and eco-friendly. Highly recommend to anyone looking to add some greenery to their space!"',
    name: 'Sarah M.',
    role: 'Happy Customer',
  },
  {
    stars: '★★★★★',
    quote: '"The Monstera I bought is thriving beautifully! Great quality plant with amazing customer service. They even included a care guide card. Will definitely be ordering more plants soon!"',
    name: 'James K.',
    role: 'Plant Enthusiast',
  },
  {
    stars: '★★★★☆',
    quote: '"Beautiful selection of plants! My office space looks so much more alive now. The delivery was fast and the plants were packed with great care. The only reason it\'s not 5 stars is I wish they had more succulents!"',
    name: 'Emily T.',
    role: 'Interior Designer',
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
          <span className="section-label">Testimonial</span>
          <h2 className="section-title">What Our Customers Say</h2>

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
                    <img src="/images/avatar.jpg" alt={t.name} className="avatar" />
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
