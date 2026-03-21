// script.js para Nassau Barbearia Premium

document.addEventListener('DOMContentLoaded', () => {

    // 1. Navbar Scroll Effect & Hero Parallax
    const navbar = document.getElementById('navbar');
    const heroSlider = document.querySelector('.hero-slider');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        // Navbar
        if (scrolled > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hero Parallax (Scrolls slightly slower than the page)
        if (heroSlider && scrolled <= window.innerHeight) {
            heroSlider.style.transform = `translateY(${scrolled * 0.45}px)`;
        }
    });

    // 2. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', toggleMenu);
    if (closeMenu) closeMenu.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // 3. Hero Background Image Sequence Animation
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const context = canvas.getContext('2d');
        const frameCount = 80;
        const currentFrame = index => (
            `Barber_trimming_beard_202603202201_${index.toString().padStart(3, '0')}.jpg`
        );

        const images = [];
        let loadedImages = 0;

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                loadedImages++;
                if (loadedImages === 1) {
                    drawFrame(0);
                }
            };
            images.push(img);
        }

        function drawFrame(index) {
            const img = images[index];
            if (!img || !img.complete || img.width === 0) return;

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const canvasRatio = canvas.width / canvas.height;
            const imgRatio = img.width / img.height;

            let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

            if (canvasRatio > imgRatio) {
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgRatio;
                offsetY = (canvas.height - drawHeight) / 2;
            } else {
                drawHeight = canvas.height;
                drawWidth = canvas.height * imgRatio;
                offsetX = (canvas.width - drawWidth) / 2;
            }

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }

        let lastTime = 0;
        let currentImageIndex = 0;
        const fps = 10;

        // Adicionando fundo escuro no canvas para efeito Fade
        canvas.style.backgroundColor = '#000';
        canvas.style.transition = 'opacity 0.2s linear';

        function animateSequence(time) {
            if (!lastTime) lastTime = time;
            const delta = time - lastTime;

            if (delta > 1000 / fps) {
                currentImageIndex = (currentImageIndex + 1) % frameCount;

                // Efeito de fade-out nos últimos 15 quadros e fade-in nos primeiros 15
                if (currentImageIndex > frameCount - 16) {
                    canvas.style.opacity = (frameCount - 1 - currentImageIndex) / 15;
                } else if (currentImageIndex < 16) {
                    canvas.style.opacity = currentImageIndex / 15;
                } else {
                    canvas.style.opacity = 1;
                }

                drawFrame(currentImageIndex);
                lastTime = time;
            }
            requestAnimationFrame(animateSequence);
        }

        requestAnimationFrame(animateSequence);

        window.addEventListener('resize', () => {
            drawFrame(currentImageIndex);
        });
    }

    // 4. Reveal on Scroll Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-on-scroll');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 5. Smooth Scrolling for anchor links (safeguard for older browsers)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80; // Altura da navbar
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 6. Cookie Banner Logic
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const rejectCookies = document.getElementById('reject-cookies');

    if (cookieBanner) {
        setTimeout(() => {
            if (!localStorage.getItem('nassau_cookies_accepted')) {
                cookieBanner.classList.add('show');
            }
        }, 1500);

        const closeBanner = () => {
            cookieBanner.classList.remove('show');
            localStorage.setItem('nassau_cookies_accepted', 'true');
        };

        if (acceptCookies) acceptCookies.addEventListener('click', closeBanner);
        if (rejectCookies) rejectCookies.addEventListener('click', closeBanner);
    }

});
