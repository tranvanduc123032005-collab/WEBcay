'use client'

import Link from 'next/link'
import Header from './components/Header'
import Footer from './components/Footer'
import TestimonialSlider from './components/TestimonialSlider'
import ProductGrid from './components/ProductGrid'
import ScrollReveal from './components/ScrollReveal'
import BackToTop from './components/BackToTop'
import ChatWidget from './components/ChatWidget'

export default function Home() {
  return (
    <>
      <Header />
      <div className="page-transition">

        {/* ===== HERO SECTION ===== */}
        <section className="hero" id="hero">
          <div className="container">
            <div className="hero-content">
              <h1>Tạo <span> ốc đảo </span><br />thu nhỏ của bạn</h1>
              <p>Chúng tôi cung cấp đa dạng các loại cây để giúp bạn tạo nên không gian xanh của riêng mình. Tìm cây hoàn hảo cho nhà hoặc văn phòng của bạn.</p>
              <Link href="/detail?id=1" className="btn btn-primary">Mua ngay</Link>
            </div>
            <div className="hero-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/hero-plant.png" alt="Monstera Plant" fetchPriority="high" loading="eager" />
            </div>
          </div>
        </section>

        {/* ===== FEATURES SECTION ===== */}
        <ScrollReveal>
          <section className="features">
            <div className="container">
              <div className="features-grid">
                {/* Feature 1 */}
                <div className="feature-card">
                  <div className="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 256 256">
                      <path d="M128,188a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h20A12,12,0,0,1,128,188Zm72-92a91.84,91.84,0,0,1-2.34,20.64C190.53,84.71,161.89,60,128,60S65.47,84.71,58.34,116.64A91.84,91.84,0,0,1,56,96,72,72,0,0,1,200,96Zm-24,0a48,48,0,0,0-96,0c0,44.18,48,84,48,84S176,140.18,176,96Z" />
                    </svg>
                  </div>
                  <h3>Cây chất lượng</h3>
                  <p>Chúng tôi cung cấp nhiều loại sản phẩm khác nhau với sự lựa chọn đa dạng trong từng danh mục.</p>
                </div>
                {/* Feature 2 */}
                <div className="feature-card">
                  <div className="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24">
                      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                    </svg>
                  </div>
                  <h3>Miễn phí giao hàng</h3>
                  <p>Chúng tôi miễn phí giao hàng cho mọi đơn hàng trên $50. Không cần hỏi thêm!</p>
                </div>
                {/* Feature 3 */}
                <div className="feature-card">
                  <div className="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24">
                      <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
                    </svg>
                  </div>
                  <h3>Hỗ trợ 24/7</h3>
                  <p>Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn.</p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ===== ABOUT US SECTION ===== */}
        <ScrollReveal>
          <section className="about" id="about">
            <div className="container">
              <div className="about-content">
                <span className="section-label">Giới thiệu</span>
                <h2 className="section-title">Thiết kế không gian đẹp &amp; độc đáo</h2>
                <p className="about-desc">Chúng tôi là đội ngũ đam mê cây cảnh, tận tâm giúp bạn tìm được cây hoàn hảo cho mọi không gian. Các chuyên gia của chúng tôi cẩn thận tuyển chọn từng bộ sưu tập.</p>
                <ul className="about-list">
                  <li>Cây khỏe mạnh được lựa chọn cẩn thận</li>
                  <li>Tư vấn tạo dáng cây chuyên nghiệp</li>
                  <li>Đảm bảo cây tươi tốt khi giao hàng</li>
                  <li>Đa dạng các loại cây quý hiếm</li>
                </ul>
                <a href="#" className="btn btn-outline">Tìm hiểu thêm</a>
              </div>
              <div className="about-images">
                <div className="about-img-grid">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/about-1.jpg" alt="Plants in room" className="about-img-large" loading="lazy" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/about-2.jpg" alt="Caring for plants" className="about-img-small" loading="lazy" />
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ===== CATEGORIES SECTION ===== */}
        <ScrollReveal>
          <section className="categories" id="categories">
            <div className="container">
              <div className="categories-header">
                <span className="section-label">Danh mục</span>
                <h2 className="section-title">Tìm kiếm những gì bạn cần</h2>
              </div>
              <div className="categories-grid">
                <div className="category-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/category-1.jpg" alt="Natural Plants" loading="lazy" />
                  <div className="category-overlay">
                    <h3>Cây tự nhiên</h3>
                  </div>
                </div>
                <div className="category-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/category-2.jpg" alt="Plant Accessories" loading="lazy" />
                  <div className="category-overlay">
                    <h3>Phụ kiện cây trồng</h3>
                  </div>
                </div>
                <div className="category-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/category-3.jpg" alt="Artificial Plants" loading="lazy" />
                  <div className="category-overlay">
                    <h3>Cây nhân tạo</h3>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ===== BEST SELLERS SECTION ===== */}
        <ScrollReveal>
          <ProductGrid />
        </ScrollReveal>

        {/* ===== TESTIMONIAL SECTION ===== */}
        <ScrollReveal>
          <TestimonialSlider />
        </ScrollReveal>

        {/* ===== FOOTER ===== */}
        <Footer />

        {/* Back to Top */}
        <BackToTop />

        {/* AI Chatbot Gemini */}
        <ChatWidget />
      </div>
    </>
  )
}
