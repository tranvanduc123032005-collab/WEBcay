/**
 * ===================================================
 * BÀI 2: TÌM HIỂU JAVASCRIPT
 * Website Plant Shop - Interactive Effects
 * ===================================================
 * Các tính năng JavaScript:
 * 1. Testimonial Slider (chuyển slide tự động & thủ công)
 * 2. Scroll Reveal Animation (hiệu ứng xuất hiện khi cuộn)
 * 3. Header Shrink on Scroll (header thu nhỏ khi cuộn)
 * 4. Smooth Scrolling Navigation (cuộn mượt khi click menu)
 * 5. Active Nav Highlight (đổi màu menu theo vị trí trang)
 * 6. Back to Top Button (nút cuộn lên đầu trang)
 * 7. Add to Cart Animation (hiệu ứng thêm giỏ hàng)
 * 8. Product Card Tilt Effect (hiệu ứng nghiêng sản phẩm)
 * ===================================================
 */

document.addEventListener('DOMContentLoaded', function () {

    // =============================================
    // 1. TESTIMONIAL SLIDER
    // Slider tự động chuyển slide mỗi 5 giây
    // Có thể bấm nút trái/phải hoặc bấm dot
    // =============================================
    const slides = document.querySelectorAll('.testimonial-card.slide');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    let currentSlide = 0;
    let autoSlideTimer;
    let isSliding = false;

    // Hàm chuyển đến slide chỉ định
    function goToSlide(index) {
        if (isSliding) return;
        isSliding = true;

        // Xóa class active của slide hiện tại
        slides[currentSlide].classList.remove('active-slide');
        dots[currentSlide].classList.remove('active');

        // Cập nhật index (vòng lặp)
        currentSlide = (index + slides.length) % slides.length;

        // Thêm class active cho slide mới
        slides[currentSlide].classList.add('active-slide');
        dots[currentSlide].classList.add('active');

        // Cho phép chuyển slide tiếp sau khi animation xong
        setTimeout(function () {
            isSliding = false;
        }, 500);
    }

    // Hàm chuyển slide tiếp theo
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    // Hàm chuyển slide trước đó
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Bắt đầu auto-slide
    function startAutoSlide() {
        autoSlideTimer = setInterval(nextSlide, 5000);
    }

    // Dừng auto-slide (khi người dùng tương tác)
    function resetAutoSlide() {
        clearInterval(autoSlideTimer);
        startAutoSlide();
    }

    // Xử lý sự kiện bấm nút Prev/Next
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function () {
            prevSlide();
            resetAutoSlide();
        });

        nextBtn.addEventListener('click', function () {
            nextSlide();
            resetAutoSlide();
        });
    }

    // Xử lý sự kiện bấm vào dot
    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            goToSlide(slideIndex);
            resetAutoSlide();
        });
    });

    // Bắt đầu chạy auto-slide khi trang load
    if (slides.length > 0) {
        startAutoSlide();
    }


    // =============================================
    // 2. SCROLL REVEAL ANIMATION
    // Các phần tử xuất hiện mượt khi cuộn trang
    // Sử dụng IntersectionObserver API
    // =============================================
    var revealElements = document.querySelectorAll(
        '.feature-card, .about-content, .about-images, ' +
        '.category-card, .product-card, .testimonial-content, ' +
        '.testimonial-image, .hero-content, .hero-image'
    );

    // Thêm class "reveal" cho tất cả phần tử cần animate
    revealElements.forEach(function (el) {
        el.classList.add('reveal');
    });

    // Kiểm tra nếu trình duyệt hỗ trợ IntersectionObserver
    if ('IntersectionObserver' in window) {
        // Tạo observer để theo dõi khi phần tử xuất hiện trên màn hình
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Ngừng theo dõi sau khi đã reveal (chỉ animate 1 lần)
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,       // Kích hoạt khi 10% phần tử hiển thị
            rootMargin: '0px 0px -30px 0px'  // Offset để timing tự nhiên hơn
        });

        // Bắt đầu theo dõi các phần tử
        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: hiện tất cả nếu trình duyệt không hỗ trợ
        revealElements.forEach(function (el) {
            el.classList.add('revealed');
        });
    }


    // =============================================
    // 3. HEADER SHRINK ON SCROLL
    // Header thu nhỏ & đổ bóng khi cuộn xuống
    // =============================================
    var header = document.querySelector('.header');

    function handleScroll() {
        var currentScrollY = window.scrollY || window.pageYOffset;

        // Header shrink
        if (currentScrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        // Back to top button
        if (backToTopBtn) {
            if (currentScrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // Hero parallax
        if (heroImage) {
            var heroSection = document.querySelector('.hero');
            if (heroSection) {
                var heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
                if (currentScrollY < heroBottom) {
                    var parallaxValue = currentScrollY * 0.15;
                    heroImage.style.transform = 'translateY(' + parallaxValue + 'px)';
                }
            }
        }

        // Active nav highlight
        updateActiveNav(currentScrollY);
    }

    // Sử dụng requestAnimationFrame để tối ưu performance
    var ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });


    // =============================================
    // 4. SMOOTH SCROLLING NAVIGATION
    // Cuộn mượt khi bấm vào các link trong menu
    // =============================================
    var navLinks = document.querySelectorAll('.navbar a[href^="#"]');

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            var targetId = this.getAttribute('href');
            var targetElement = document.querySelector(targetId);

            if (targetElement) {
                var headerHeight = header.offsetHeight;
                var targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // =============================================
    // 5. ACTIVE NAV HIGHLIGHT
    // Tự động đánh dấu menu active theo vị trí trang
    // =============================================
    var sections = document.querySelectorAll('section[id], footer[id]');

    function updateActiveNav(scrollY) {
        var scrollPosition = (scrollY || window.scrollY) + header.offsetHeight + 100;

        sections.forEach(function (section) {
            var sectionTop = section.offsetTop;
            var sectionHeight = section.offsetHeight;
            var sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Xóa active tất cả nav links
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                });

                // Thêm active cho link tương ứng
                var activeLink = document.querySelector('.navbar a[href="#' + sectionId + '"]');
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }


    // =============================================
    // 6. BACK TO TOP BUTTON
    // Hiện nút khi cuộn xuống 300px, ẩn khi ở đầu trang
    // =============================================
    var backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // =============================================
    // 7. ADD TO CART ANIMATION
    // Hiệu ứng khi bấm nút + thêm vào giỏ hàng
    // Tăng số trên badge, hiện thông báo toast
    // =============================================
    var addToCartBtns = document.querySelectorAll('.add-to-cart');
    var cartBadge = document.getElementById('cart-badge');
    var toast = document.getElementById('toast');
    var toastMessage = document.getElementById('toast-message');
    var cartCount = 0;
    var toastTimeout;

    function showToast(message) {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = message;
        toast.classList.add('toast-visible');

        // Xóa timeout cũ nếu có
        clearTimeout(toastTimeout);

        // Ẩn toast sau 3 giây
        toastTimeout = setTimeout(function () {
            toast.classList.remove('toast-visible');
        }, 3000);
    }

    addToCartBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            // Tăng số lượng giỏ hàng
            cartCount++;
            if (cartBadge) {
                cartBadge.textContent = cartCount;
                cartBadge.classList.add('badge-bounce');
            }

            // Lấy tên sản phẩm
            var productCard = this.closest('.product-card');
            var productName = productCard ? productCard.querySelector('h3').textContent : 'Sản phẩm';

            // Hiệu ứng nút
            this.classList.add('cart-added');
            this.textContent = '✓';

            var currentBtn = this;

            // Reset nút sau 1.5 giây
            setTimeout(function () {
                currentBtn.classList.remove('cart-added');
                currentBtn.textContent = '+';
            }, 1500);

            // Xóa bounce badge
            setTimeout(function () {
                if (cartBadge) {
                    cartBadge.classList.remove('badge-bounce');
                }
            }, 600);

            // Hiện toast thông báo
            showToast(productName + ' đã thêm vào giỏ hàng!');
        });
    });


    // =============================================
    // 8. PRODUCT CARD TILT EFFECT
    // Hiệu ứng nghiêng nhẹ khi di chuột qua sản phẩm
    // Chỉ áp dụng trên desktop (không phải touch device)
    // =============================================
    var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        var productCards = document.querySelectorAll('.product-card');

        productCards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;   // Vị trí chuột X trong card
                var y = e.clientY - rect.top;     // Vị trí chuột Y trong card
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;

                // Tính góc nghiêng (tối đa 3 độ - nhẹ nhàng hơn)
                var rotateX = ((y - centerY) / centerY) * -3;
                var rotateY = ((x - centerX) / centerX) * 3;

                card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-5px)';
            });

            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }


    // =============================================
    // 9. COUNTER ANIMATION (Số liệu chạy)
    // Đếm tăng dần khi phần tử xuất hiện trên màn hình
    // =============================================
    var counters = document.querySelectorAll('.counter');

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-target'));
        if (isNaN(target)) return;
        var duration = 2000; // 2 giây
        var increment = target / (duration / 16); // 60fps
        var current = 0;

        function updateCounter() {
            current += increment;
            if (current < target) {
                el.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target;
            }
        }

        updateCounter();
    }

    // Observer cho counter
    if (counters.length > 0 && 'IntersectionObserver' in window) {
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    }


    // =============================================
    // 10. HERO IMAGE PARALLAX
    // Hiệu ứng parallax nhẹ cho ảnh hero khi cuộn trang
    // (Logic đã được tích hợp vào handleScroll ở trên)
    // =============================================
    var heroImage = document.querySelector('.hero-image img');

    // Gọi handleScroll lần đầu để cập nhật trạng thái ban đầu
    handleScroll();

    // Log thông báo vào console
    console.log('🌿 ĐỨC NGƯỜI CÂY - All JavaScript effects loaded successfully!');
});
