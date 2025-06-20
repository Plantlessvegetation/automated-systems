// Ensure GSAP is loaded before using it
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/ScrollTrigger.min.js"></script>

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    // --- Page Load Animation ---
    const pageLoadOverlay = document.getElementById('page-load-overlay');
    // Hide the overlay after a short delay
    setTimeout(() => {
        pageLoadOverlay.classList.add('hidden');
    }, 2000); // Wait for 2 seconds (including line sweep animation)

    // --- Navigation Bar Functionality (Hamburger Menu) ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');

    hamburgerMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navbar.classList.toggle('mobile-active');
    });

    // Close mobile nav after clicking a link (smooth scroll)
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Scroll to the target element with offset for sticky header
                const headerOffset = navbar.offsetHeight; // Get dynamic header height
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }

            // Close mobile nav after clicking a link
            navLinks.classList.remove('active');
            navbar.classList.remove('mobile-active');
        });
    });

    // --- Hero Section Animations ---
    gsap.from(".hero-title", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out"
    });
    gsap.from(".hero-tagline", {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.3,
        ease: "power3.out"
    });
    gsap.from(".cta-button", {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        delay: 0.6,
        ease: "back.out(1.7)"
    });

    // --- Particle Field Effect (Hero Section) ---
    const particleField = document.querySelector('.particle-field');
    if (particleField) {
        const canvas = document.createElement('canvas');
        particleField.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 50;

        function resizeCanvas() {
            canvas.width = particleField.clientWidth;
            canvas.height = particleField.clientHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.8;
                this.color = `rgba(255, 215, 0, ${this.opacity})`; // Gold particles
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Recycle particles if they go off screen
                if (this.size > 0.1) this.size -= 0.01;
                if (this.opacity > 0.01) this.opacity -= 0.005;

                if (this.size <= 0.1 || this.opacity <= 0.01) {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 2 + 0.5;
                    this.speedX = Math.random() * 0.5 - 0.25;
                    this.speedY = Math.random() * 0.5 - 0.25;
                    this.opacity = Math.random() * 0.8;
                    this.color = `rgba(255, 215, 0, ${this.opacity})`;
                }
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
            }
        }
        initParticles();

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }


    // --- Product Card Animations (GSAP ScrollTrigger & 3D Tilt) ---
    gsap.from(".product-lineup h2", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".product-lineup",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });

    gsap.utils.toArray(".product-card").forEach(card => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none none"
            }
        });

        // 3D hover tilt effect
        card.addEventListener('mousemove', (e) => {
            const {
                left,
                top,
                width,
                height
            } = card.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;

            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Normalize mouse position from -1 to 1
            const normalizedX = (mouseX - centerX) / (width / 2);
            const normalizedY = (mouseY - centerY) / (height / 2);

            const rotateX = normalizedY * 10; // Max 10 degrees rotation
            const rotateY = normalizedX * -10; // Max 10 degrees rotation (inverted for natural feel)

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });

    // --- About Section Timeline Animations (GSAP ScrollTrigger) ---
    gsap.utils.toArray(".timeline-item").forEach(item => {
        gsap.from(item, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: item,
                start: "top 90%",
                toggleActions: "play none none none"
            }
        });
    });

    // --- Accordion Functionality (for Plans and FAQ) ---
    document.querySelectorAll('.accordion-header').forEach(button => {
        button.addEventListener('click', () => {
            const accordionContent = button.nextElementSibling;
            const currentlyActive = document.querySelector('.accordion-header.active');

            // Close currently open accordion if different
            if (currentlyActive && currentlyActive !== button) {
                currentlyActive.classList.remove('active');
                currentlyActive.nextElementSibling.style.maxHeight = "0";
                currentlyActive.nextElementSibling.style.paddingTop = "0";
                currentlyActive.nextElementSibling.style.paddingBottom = "0";
            }

            // Toggle clicked accordion
            button.classList.toggle('active');
            if (button.classList.contains('active')) {
                accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
                accordionContent.style.paddingTop = "1rem";
                accordionContent.style.paddingBottom = "1rem";
            } else {
                accordionContent.style.maxHeight = "0";
                accordionContent.style.paddingTop = "0";
                accordionContent.style.paddingBottom = "0";
            }
        });
    });

    // --- Modal Functionality for "Buy Now" Buttons ---
    const modal = document.getElementById('buyNowModal');
    const closeButton = document.querySelector('.modal .close-button');
    const buyNowButtons = document.querySelectorAll('.plan-card .filled-btn'); // For plans
    const productCardBuyButtons = document.querySelectorAll('.product-card .filled-btn'); // For product cards
    const modalProductName = document.getElementById('modalProductName');
    const modalProductPrice = document.getElementById('modalProductPrice');

    const openModal = (name, price) => {
        modalProductName.textContent = `Product: ${name}`;
        modalProductPrice.textContent = `Price: ${price}`;
        modal.style.display = 'flex'; // Show modal
    };

    buyNowButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.plan-card');
            const productName = card.querySelector('.plan-name').textContent;
            const productPrice = card.querySelector('.plan-price').textContent;
            openModal(productName, productPrice);
        });
    });

    productCardBuyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const productName = card.querySelector('.product-name').textContent;
            const productPrice = card.querySelector('.pricing-badge').textContent;
            openModal(productName, productPrice);
        });
    });


    closeButton.addEventListener('click', () => {
        modal.style.display = 'none'; // Hide modal
    });

    // Close modal if clicked outside
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Placeholder for confirm purchase action
    document.querySelector('.confirm-purchase-btn').addEventListener('click', () => {
        alert('Proceeding to checkout! (This is a placeholder)');
        modal.style.display = 'none';
    });


    // --- Floating Chatbot Icon (Conceptual) ---
    const chatbotIcon = document.querySelector('.chatbot-icon');
    if (chatbotIcon) {
        chatbotIcon.addEventListener('click', () => {
            alert("Chatbot coming soon! (This is where your live chat widget would open)");
            // In a real application, you'd integrate a chat widget library here.
        });
    }

    // --- Footer Particle Field ---
    class FooterParticle extends Particle { // Re-using Particle class from Hero
        constructor(x, y, canvas, ctx) {
            super(x, y); // Call parent constructor
            this.size = Math.random() * 1.5 + 0.3; // Smaller particles
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
            this.opacity = Math.random() * 0.7;
            this.color = `rgba(0, 255, 255, ${this.opacity})`; // Neon Cyan particles
            this.canvas = canvas;
            this.ctx = ctx;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.size > 0.1) this.size -= 0.01;
            if (this.opacity > 0.01) this.opacity -= 0.005;

            if (this.size <= 0.1 || this.opacity <= 0.01) {
                this.x = Math.random() * this.canvas.width;
                this.y = Math.random() * this.canvas.height;
                this.size = Math.random() * 1.5 + 0.3;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * 0.4 - 0.2;
                this.opacity = Math.random() * 0.7;
                this.color = `rgba(0, 255, 255, ${this.opacity})`;
            }
        }
    }

    const footerParticleField = document.querySelector('.footer-particles');
    if (footerParticleField) {
        const footerCanvas = document.createElement('canvas');
        footerParticleField.appendChild(footerCanvas);
        const footerCtx = footerCanvas.getContext('2d');
        let footerParticles = [];
        const footerParticleCount = 30;

        function resizeFooterCanvas() {
            footerCanvas.width = footerParticleField.clientWidth;
            footerCanvas.height = footerParticleField.clientHeight;
        }
        window.addEventListener('resize', resizeFooterCanvas);
        resizeFooterCanvas();

        function initFooterParticles() {
            for (let i = 0; i < footerParticleCount; i++) {
                footerParticles.push(new FooterParticle(Math.random() * footerCanvas.width, Math.random() * footerCanvas.height, footerCanvas, footerCtx));
            }
        }
        initFooterParticles();

        function animateFooterParticles() {
            footerCtx.clearRect(0, 0, footerCanvas.width, footerCanvas.height);
            for (let i = 0; i < footerParticles.length; i++) {
                footerParticles[i].update();
                footerParticles[i].draw(); // Particle.draw uses ctx, which is passed from the canvas it's on
            }
            requestAnimationFrame(animateFooterParticles);
        }
        animateFooterParticles();
    }
});