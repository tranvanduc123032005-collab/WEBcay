import Link from 'next/link'
import Header from './components/Header'
import Footer from './components/Footer'
import TestimonialSlider from './components/TestimonialSlider'
import ProductGrid from './components/ProductGrid'
import BackToTop from './components/BackToTop'

export default function Home() {
  return (
    <>
      <Header />

      {/* ===== HERO SECTION ===== */}
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Create your own<br />mini<span className="highlight"> plant </span></h1>
            <p>We offer a wide range of plants to help you create your own green space. Find the perfect plant for your home or office.</p>
            <Link href="/detail" className="btn btn-primary">Mua Ngay</Link>
          </div>
          <div className="hero-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/hero-plant.png" alt="Monstera Plant" />
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
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
              <h3>Large Assortment</h3>
              <p>We offer many different types of products with fewer variations in each category.</p>
            </div>
            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24">
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                </svg>
              </div>
              <h3>Free Shipping</h3>
              <p>We offer free shipping on all orders over $50. No questions asked!</p>
            </div>
            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24">
                  <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
                </svg>
              </div>
              <h3>24/7 Support</h3>
              <p>Our support team is available around the clock to answer your questions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT US SECTION ===== */}
      <section className="about" id="about">
        <div className="container">
          <div className="about-content">
            <span className="section-label">About Us</span>
            <h2 className="section-title">We design Beautiful &amp; Unique Spaces</h2>
            <p className="about-desc">We are a team of passionate plant lovers dedicated to helping you find the perfect plant for every space. Our experts carefully curate each collection.</p>
            <ul className="about-list">
              <li>Handpicked healthy plants</li>
              <li>Expert plant styling advice</li>
              <li>Guaranteed freshness on delivery</li>
              <li>Wide variety of rare species</li>
            </ul>
            <a href="#" className="btn btn-outline">Learn More</a>
          </div>
          <div className="about-images">
            <div className="about-img-grid">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/about-1.jpg" alt="Plants in room" className="about-img-large" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/about-2.jpg" alt="Caring for plants" className="about-img-small" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="categories" id="categories">
        <div className="container">
          <div className="categories-header">
            <span className="section-label">Categories</span>
            <h2 className="section-title">Find what you are looking for</h2>
          </div>
          <div className="categories-grid">
            <div className="category-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/category-1.jpg" alt="Natural Plants" />
              <div className="category-overlay">
                <h3>Natural Plants</h3>
              </div>
            </div>
            <div className="category-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/category-2.jpg" alt="Plant Accessories" />
              <div className="category-overlay">
                <h3>Plant Accessories</h3>
              </div>
            </div>
            <div className="category-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/category-3.jpg" alt="Artificial Plants" />
              <div className="category-overlay">
                <h3>Artificial Plants</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BEST SELLERS SECTION ===== */}
      <ProductGrid />

      {/* ===== TESTIMONIAL SECTION ===== */}
      <TestimonialSlider />

      {/* ===== FOOTER ===== */}
      <Footer />

      {/* Back to Top */}
      <BackToTop />
    </>
  )
}
