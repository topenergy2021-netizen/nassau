document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Background on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    // 3. Apple-like Scroll Hero Animation with Canvas
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const context = canvas.getContext('2d');
        const heroSection = document.querySelector('.hero-section');
        
        const frameCount = 247;
        // Helper to pad the frame numbers like "0001", "0025", "0247"
        const currentFrame = index => `ANIMA/${index.toString().padStart(4, '0')}.jpg`;

        const images = [];
        const preloadImages = () => {
            for (let i = 1; i <= frameCount; i++) {
                const img = new Image();
                img.src = currentFrame(i);
                images.push(img);
            }
        };

        // Make canvas resize optimally
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Re-draw current frame properly centered/covered
            if (images[lastRenderedFrameIndex] && images[lastRenderedFrameIndex].complete) {
                renderFrame(images[lastRenderedFrameIndex]);
            }
        }

        window.addEventListener('resize', resizeCanvas);

        let lastRenderedFrameIndex = 0;

        function renderFrame(img) {
            if (!img || !img.complete || img.naturalWidth === 0) return;
            
            // Emulate object-fit: cover logic on canvas
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio  = Math.max(hRatio, vRatio);
            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;  
            
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0,0, img.width, img.height,
                              centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        }

        // Preload & setup first frame
        preloadImages();
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Automatic slow-motion animation loop
        let currentFrameIndex = 0;
        let lastTime = 0;
        const fps = 12; // 12 frames per second for a nice slow-motion effect
        const frameInterval = 1000 / fps;

        function animate(time) {
            if (!lastTime) lastTime = time;
            const elapsed = time - lastTime;

            if (elapsed > frameInterval) {
                lastTime = time - (elapsed % frameInterval);
                
                if (images[currentFrameIndex] && images[currentFrameIndex].complete) {
                    renderFrame(images[currentFrameIndex]);
                    lastRenderedFrameIndex = currentFrameIndex;
                }
                
                // Loop the animation
                currentFrameIndex = (currentFrameIndex + 1) % frameCount;
            }
            requestAnimationFrame(animate);
        }

        // Start animation
        images[0].onload = () => {
            requestAnimationFrame(animate);
        };
        // fallback if it was instantly cached
        if (images[0].complete) {
            requestAnimationFrame(animate);
        }
    }

    // 4. Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => observer.observe(el));
});
