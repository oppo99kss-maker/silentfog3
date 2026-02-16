// ============================================
// Silent Fog — App v4
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // FOG ENTRANCE (Removed)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Logic removed as overlay is deleted from HTML

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // MOBILE MENU
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');
    const mobileOverlay = document.getElementById('mobile-overlay');

    function openMenu() {
        navLinks.classList.add('active');
        mobileOverlay.classList.add('active');
        const icon = menuBtn.querySelector('i');
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navLinks.classList.remove('active');
        mobileOverlay.classList.remove('active');
        const icon = menuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        // Don't restore overflow if fog is still showing
        if (!fogOverlay || fogOverlay.classList.contains('fade-out')) {
            document.body.style.overflow = '';
        }
    }

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.contains('active') ? closeMenu() : openMenu();
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close on overlay click
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', closeMenu);
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // NAVBAR SCROLL EFFECT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    }, { passive: true });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SCROLL REVEAL (Intersection Observer)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STATS COUNTER ANIMATION
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let statsAnimated = false;

    function animateCounters() {
        if (statsAnimated) return;
        statsAnimated = true;

        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current >= target) {
                    num.textContent = target + '+';
                    return;
                }
                num.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            };

            requestAnimationFrame(updateCounter);
        });
    }

    // Observe stats bar for counter animation
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsBar);
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // LIGHTBOX GALLERY
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const closeLightboxBtn = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.prev-img');
    const nextBtn = document.querySelector('.next-img');

    let currentGallery = [];
    let currentIndex = 0;

    const categories = {
        'pyramid': {
            title: 'تشكيلة الألوان العصرية',
            desc: 'مجموعة متنوعة من المظلات بخيارات ألوان متعددة وتصاميم هندسية فاخرة.',
            images: ['images/n1.jpeg', 'images/n2.jpeg', 'images/n3.jpeg']
        },
        'ordinary-logo': {
            title: 'المظلات الفاخرة - إصدار اللوقو',
            desc: 'يمكننا تنفيذ لوقو محلك الخاص وبأحجام مختلفة تناسب جميع المساحات.',
            images: ['images/b1.jpeg', 'images/b2.jpeg', 'images/b3.jpeg', 'images/b4.jpeg']
        },
        'mist-outlets': {
            title: 'مظلات بمخارج الضباب',
            desc: 'تقنيات متطورة لدمج مخارج الضباب مباشرة في هيكل المظلة.',
            images: ['images/r1.jpeg', 'images/r2.jpeg']
        },
        'mist-foundation': {
            title: 'تأسيس أنظمة الضباب',
            desc: 'نماذج توضيحية لعمليات التأسيس والتركيب الاحترافي.',
            images: ['images/a1.jpeg', 'images/a2.jpeg', 'images/a3.jpeg']
        },
        'engineering-details': {
            title: 'تفاصيل هندسية',
            desc: 'نهتم بالتفاصيل لضمان أعلى جودة في التنفيذ والأداء.',
            images: ['images/m1.jpeg', 'images/m2.jpeg', 'images/m3.jpeg', 'images/m4.jpeg', 'images/m5.jpeg', 'images/m6.jpeg']
        },
        'mist-equipment': {
            title: 'المعدات والقطع',
            desc: 'نوفر أفضل المعدات وقطع الغيار الأصلية (تايواني وايطالي والماني) لضمان استمرارية النظام.',
            images: ['images/t1.jpeg', 'images/t2.jpeg', 'images/t3.jpeg', 'images/t4.jpeg', 'images/t5.jpeg']
        },
        'laser-columns': {
            title: 'أعمدة الضباب - قص ليزر',
            desc: 'تشكيلة متنوعة من الأعمدة الفاخرة مع إمكانية إضافة اللوقو والإنارة.',
            images: ['images/s1.jpeg', 'images/s2.jpeg', 'images/s3.jpeg', 'images/s4.jpeg', 'images/v1.jpeg', 'images/v2.jpeg']
        },
        'digital-menu': {
            title: 'المنيو الرقمي الذكي',
            desc: 'قائمة طعام تفاعلية عبر QR Code مع صور جذابة وتصميم عصري يسهل الطلب.',
            images: ['images/digital_menu_concept.png']
        }
    };

    // Add counter badge to lightbox (dynamic)
    let counterEl = document.querySelector('.lightbox-counter');
    if (!counterEl && lightbox) {
        counterEl = document.createElement('div');
        counterEl.className = 'lightbox-counter';
        lightbox.querySelector('.lightbox-content')?.prepend(counterEl);
    }

    function updateLightbox() {
        if (currentGallery.length > 0) {
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = currentGallery[currentIndex];
                lightboxImg.onload = () => {
                    lightboxImg.style.opacity = '1';
                };
            }, 200);
            // Update counter
            if (counterEl) {
                counterEl.textContent = (currentIndex + 1) + ' / ' + currentGallery.length;
                counterEl.style.display = currentGallery.length > 1 ? 'block' : 'none';
            }
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PORTFOLIO GALLERY (Our Work)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioImages = [];
    portfolioItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) portfolioImages.push(img.src);
    });

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.getAttribute('data-index')) || 0;
            currentGallery = portfolioImages;
            currentIndex = idx;
            const label = item.querySelector('.portfolio-label');
            lightboxTitle.textContent = label ? label.textContent : 'من أعمالنا';
            lightboxDesc.textContent = '';
            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Category click handler
    document.querySelectorAll('.umbrella-category').forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const catId = card.getAttribute('data-category');
            const data = categories[catId];
            if (data) {
                currentGallery = data.images;
                currentIndex = 0;
                lightboxTitle.textContent = data.title;
                lightboxDesc.textContent = data.desc;
                updateLightbox();
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close handlers
    if (closeLightboxBtn) {
        closeLightboxBtn.addEventListener('click', closeLightbox);
    }

    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentGallery.length > 1) {
                currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
                updateLightbox();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentGallery.length > 1) {
                currentIndex = (currentIndex + 1) % currentGallery.length;
                updateLightbox();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox?.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') nextBtn?.click();
        if (e.key === 'ArrowRight') prevBtn?.click();
        if (e.key === 'Escape') closeLightbox();
    });

    // Touch swipe for lightbox
    let touchStartX = 0;
    lightbox?.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox?.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextBtn?.click();
            else prevBtn?.click();
        }
    }, { passive: true });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SMOOTH SCROLL FOR ANCHORS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // FAQ ACCORDION
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const category = item.closest('.faq-category');

            // Close other items in same category
            category.querySelectorAll('.faq-item.active').forEach(active => {
                if (active !== item) active.classList.remove('active');
            });

            item.classList.toggle('active');
        });
    });

});
