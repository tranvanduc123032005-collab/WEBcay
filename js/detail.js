/**
 * ===================================================
 * DETAIL.JS - JavaScript cho trang chi tiết sản phẩm
 * ===================================================
 * Các tính năng:
 * 1. Thumbnail Gallery (bấm ảnh nhỏ đổi ảnh lớn)
 * 2. Quantity Selector (nút +/- thay đổi số lượng)
 * 3. Size Button Toggle (chọn kích thước)
 * 4. Image Zoom on Hover (phóng to ảnh khi hover)
 * ===================================================
 */

document.addEventListener('DOMContentLoaded', function () {

    // =============================================
    // 1. THUMBNAIL GALLERY
    // Bấm ảnh nhỏ để đổi ảnh lớn, có hiệu ứng fade
    // =============================================
    const mainImage = document.querySelector('.main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');

    thumbnails.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            // Xóa active tất cả thumbnail
            thumbnails.forEach(function (t) {
                t.classList.remove('active');
            });

            // Thêm active cho thumbnail được bấm
            this.classList.add('active');

            // Hiệu ứng fade khi đổi ảnh
            mainImage.style.opacity = '0';
            mainImage.style.transform = 'scale(0.95)';

            setTimeout(function () {
                mainImage.src = thumb.src;
                mainImage.style.opacity = '1';
                mainImage.style.transform = 'scale(1)';
            }, 300);
        });
    });

    // Thêm CSS transition cho main image
    if (mainImage) {
        mainImage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }


    // =============================================
    // 2. QUANTITY SELECTOR
    // Nút +/- để tăng giảm số lượng sản phẩm
    // =============================================
    const qtyBtns = document.querySelectorAll('.qty-btn');
    const qtyInput = document.querySelector('.qty-input');

    if (qtyInput) {
        qtyBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                let currentQty = parseInt(qtyInput.value) || 1;

                if (this.textContent.trim() === '-') {
                    // Giảm, nhưng không nhỏ hơn 1
                    if (currentQty > 1) {
                        currentQty--;
                    }
                } else if (this.textContent.trim() === '+') {
                    // Tăng, tối đa 99
                    if (currentQty < 99) {
                        currentQty++;
                    }
                }

                qtyInput.value = currentQty;

                // Hiệu ứng nhẹ cho nút
                this.style.transform = 'scale(0.9)';
                setTimeout(function () {
                    btn.style.transform = 'scale(1)';
                }, 150);
            });
        });

        // Validate input trực tiếp
        qtyInput.addEventListener('change', function () {
            let val = parseInt(this.value);
            if (isNaN(val) || val < 1) {
                this.value = 1;
            } else if (val > 99) {
                this.value = 99;
            }
        });
    }


    // =============================================
    // 3. SIZE BUTTON TOGGLE
    // Bấm nút Size để chuyển đổi active
    // =============================================
    const sizeBtns = document.querySelectorAll('.size-btn');

    sizeBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Xóa active tất cả
            sizeBtns.forEach(function (b) {
                b.classList.remove('active');
            });

            // Thêm active cho nút được bấm
            this.classList.add('active');

            // Hiệu ứng scale nhẹ
            this.style.transform = 'scale(1.05)';
            setTimeout(function () {
                btn.style.transform = 'scale(1)';
            }, 200);
        });
    });


    // =============================================
    // 4. IMAGE ZOOM ON HOVER
    // Di chuột trên ảnh lớn sẽ phóng to vùng chuột
    // =============================================
    const gallery = document.querySelector('.product-gallery');

    if (mainImage && gallery) {
        mainImage.addEventListener('mousemove', function (e) {
            const rect = mainImage.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            mainImage.style.transformOrigin = x + '% ' + y + '%';
            mainImage.style.transform = 'scale(1.5)';
        });

        mainImage.addEventListener('mouseleave', function () {
            mainImage.style.transformOrigin = 'center center';
            mainImage.style.transform = 'scale(1)';
        });
    }


    // =============================================
    // 5. ADD TO CART BUTTON
    // Hiệu ứng khi bấm nút Add to Cart
    // =============================================
    const addToCartBtn = document.querySelector('.btn-full');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function (e) {
            e.preventDefault();

            const originalText = this.textContent;
            this.textContent = '✓ Added to Cart!';
            this.style.backgroundColor = '#27ae60';

            setTimeout(function () {
                addToCartBtn.textContent = originalText;
                addToCartBtn.style.backgroundColor = '';
            }, 2000);
        });
    }

    console.log('🌿 Detail page JavaScript loaded successfully!');
});
