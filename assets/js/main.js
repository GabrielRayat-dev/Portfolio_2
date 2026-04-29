document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check local storage for theme
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
        body.className = `theme-${savedTheme}`;
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    } else {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.className = 'theme-dark';
            themeToggle.textContent = '☀️';
        }
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('theme-light')) {
            body.className = 'theme-dark';
            themeToggle.textContent = '☀️';
            localStorage.setItem('portfolio-theme', 'dark');
        } else {
            body.className = 'theme-light';
            themeToggle.textContent = '🌙';
            localStorage.setItem('portfolio-theme', 'light');
        }
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileToggle.innerHTML = navLinks.classList.contains('active') ? '&times;' : '&#9776;';
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileToggle.innerHTML = '&#9776;';
        });
    });

    // Scroll Reveal Animation using Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.hidden-reveal').forEach((el) => {
        observer.observe(el);
    });

    // Subtle Particle Background
    initParticles();
});

function initParticles() {
    const canvasContainer = document.getElementById('particles');
    if (!canvasContainer) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvasContainer.appendChild(canvas);

    let width, height;
    let particles = [];
    let explosions = [];

    function resize() {
        width = canvasContainer.clientWidth;
        height = canvasContainer.clientHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * -0.5 - 0.1; // Float upwards
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.y < 0) {
                this.y = height;
                this.x = Math.random() * width;
            }
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
        }

        draw() {
            const isDark = document.body.classList.contains('theme-dark');
            const color = isDark ? `rgba(212, 175, 55, ${this.opacity})` : `rgba(183, 123, 33, ${this.opacity})`;
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class ExplodingParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 2 + 1;
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 4 + 1;
            this.speedX = Math.cos(angle) * velocity;
            this.speedY = Math.sin(angle) * velocity;
            this.opacity = 1;
            this.life = Math.random() * 30 + 20; // Frames before disappearing
            this.remainingLife = this.life;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity = this.remainingLife / this.life;
            this.remainingLife--;
        }

        draw() {
            const isDark = document.body.classList.contains('theme-dark');
            const color = isDark ? `rgba(212, 175, 55, ${this.opacity})` : `rgba(183, 123, 33, ${this.opacity})`;
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        const numParticles = Math.min(width * height / 10000, 100);
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    createParticles();

    // Add click listener for explosions
    const homeSection = document.getElementById('home');
    if (homeSection) {
        homeSection.addEventListener('click', (e) => {
            // Don't trigger if clicking on buttons or links
            if (e.target.closest('a, button')) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Generate explosion particles
            const numExplosionParticles = Math.random() * 10 + 15; // 15 to 25 particles
            for (let i = 0; i < numExplosionParticles; i++) {
                explosions.push(new ExplodingParticle(x, y));
            }
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw normal particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw and update explosion particles
        for (let i = explosions.length - 1; i >= 0; i--) {
            const p = explosions[i];
            p.update();
            p.draw();

            // Remove dead particles
            if (p.remainingLife <= 0) {
                explosions.splice(i, 1);
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}
