// StudyWeb - Advanced Interactive Homepage
class StudyWebApp {
    constructor() {
        this.particles = [];
        this.currentTestimonial = 0;
        this.isAnimating = false;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        console.log('🚀 Welcome to StudyWeb! The future of learning awaits...');
        
        // Initialize all components
        this.initParticleSystem();
        this.initSmoothScrolling();
        this.initNavigationHighlighting();
        this.initCounterAnimations();
        this.initTiltEffects();
        this.initCategoryTabs();
        this.initTestimonialCarousel();
        this.initThemeToggle();
        this.initSearchFunctionality();
        this.initFAB();
        this.initMagneticButtons();
        this.initNewsletterSignup();
        this.initScrollAnimations();
        this.initMobileMenu();
        this.initProgressCircles();
        this.initLoadMoreButton();
        
        // Add global event listeners
        this.addGlobalEventListeners();
    }

    // Particle System for Hero Background
    initParticleSystem() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Resize canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 2;
                this.speedY = (Math.random() - 0.5) * 2;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.symbol = this.getRandomSymbol();
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;
                this.rotation = 0;
            }

            getRandomSymbol() {
                const symbols = ['📚', '🔬', '⚛️', '📐', '🧮', '💡', '🎓', '📝', '🔍', '💻'];
                return symbols[Math.floor(Math.random() * symbols.length)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;

                // Wrap around edges
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;

                // Mouse interaction
                const dx = this.mouseX - this.x;
                const dy = this.mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    this.x -= (dx / distance) * force * 2;
                    this.y -= (dy / distance) * force * 2;
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.font = `${this.size * 8}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.symbol, 0, 0);
                ctx.restore();
            }
        }

        // Create particles
        for (let i = 0; i < 50; i++) {
            this.particles.push(new Particle());
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            this.particles.forEach(particle => {
                particle.mouseX = this.mouseX;
                particle.mouseY = this.mouseY;
                particle.update();
                particle.draw();
            });

            // Draw connections
            this.particles.forEach((particle, i) => {
                this.particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.strokeStyle = `rgba(100, 255, 218, ${0.1 * (1 - distance / 150)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        };

        animate();
    }

    // Smooth Scrolling
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Navigation Highlighting
    initNavigationHighlighting() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                    
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    // Counter Animations
    initCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const start = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(target * easeOutCubic);
                
                if (target > 1000) {
                    counter.textContent = (current / 1000).toFixed(0) + 'k+';
                } else {
                    counter.textContent = current + (target === 98 ? '%' : '+');
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        };

        // Intersection Observer for counters
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // 3D Tilt Effects
    initTiltEffects() {
        const tiltCards = document.querySelectorAll('.tilt-card');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -10;
                const rotateY = (x - centerX) / centerX * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });
    }

    // Category Tabs
    initCategoryTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const materialCards = document.querySelectorAll('.material-card');
        const tabIndicator = document.querySelector('.tab-indicator');

        const updateIndicator = (activeTab) => {
            const rect = activeTab.getBoundingClientRect();
            const container = activeTab.parentElement.getBoundingClientRect();
            
            if (tabIndicator) {
                tabIndicator.style.width = `${rect.width}px`;
                tabIndicator.style.left = `${rect.left - container.left}px`;
            }
        };

        tabBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category');
                
                // Update active tab
                tabBtns.forEach(tab => tab.classList.remove('active'));
                btn.classList.add('active');
                
                // Update indicator
                updateIndicator(btn);
                
                // Filter materials
                materialCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeInUp 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // Initialize indicator position
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            updateIndicator(activeTab);
        }
    }

    // Testimonial Carousel
    initTestimonialCarousel() {
        const track = document.getElementById('testimonialTrack');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const dotsContainer = document.getElementById('carouselDots');
        const testimonials = document.querySelectorAll('.testimonial-card');

        if (!track || !testimonials.length) return;

        // Create dots
        testimonials.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToTestimonial(index));
            dotsContainer.appendChild(dot);
        });

        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousTestimonial());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextTestimonial());
        }

        // Auto-rotate testimonials
        setInterval(() => this.nextTestimonial(), 5000);
    }

    goToTestimonial(index) {
        if (this.isAnimating) return;
        
        const track = document.getElementById('testimonialTrack');
        const testimonials = document.querySelectorAll('.testimonial-card');
        const dots = document.querySelectorAll('.dot');

        this.currentTestimonial = index;
        this.isAnimating = true;

        // Update transform
        track.style.transform = `translateX(-${index * 100}%)`;

        // Update active states
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // Reset animation flag
        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }

    nextTestimonial() {
        const testimonials = document.querySelectorAll('.testimonial-card');
        const nextIndex = (this.currentTestimonial + 1) % testimonials.length;
        this.goToTestimonial(nextIndex);
    }

    previousTestimonial() {
        const testimonials = document.querySelectorAll('.testimonial-card');
        const prevIndex = (this.currentTestimonial - 1 + testimonials.length) % testimonials.length;
        this.goToTestimonial(prevIndex);
    }

    // Theme Toggle
    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('light-theme');
                const isLight = document.body.classList.contains('light-theme');
                themeToggle.textContent = isLight ? '☀️' : '🌙';
                
                // Animate the toggle
                themeToggle.style.transform = 'rotate(360deg)';
                setTimeout(() => {
                    themeToggle.style.transform = 'rotate(0deg)';
                }, 300);
            });
        }
    }

    // Search Functionality
    initSearchFunctionality() {
        const searchInput = document.getElementById('heroSearch');
        const searchBtn = document.querySelector('.search-btn');

        if (searchInput) {
            searchInput.addEventListener('focus', () => {
                searchInput.parentElement.style.transform = 'scale(1.02)';
            });

            searchInput.addEventListener('blur', () => {
                searchInput.parentElement.style.transform = 'scale(1)';
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value);
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput ? searchInput.value : '';
                this.performSearch(query);
            });
        }
    }

    performSearch(query) {
        if (!query.trim()) return;
        
        console.log(`🔍 Searching for: ${query}`);
        
        // Animate search button
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.style.transform = 'translateY(-50%) scale(0.9)';
            setTimeout(() => {
                searchBtn.style.transform = 'translateY(-50%) scale(1.1)';
                setTimeout(() => {
                    searchBtn.style.transform = 'translateY(-50%) scale(1)';
                }, 100);
            }, 100);
        }

        // In a real app, this would trigger actual search functionality
        this.showSearchResults(query);
    }

    showSearchResults(query) {
        // Mock search results display
        const resultsHtml = `
            <div class="search-results glassmorphism" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 10000;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
            ">
                <h3>Search Results for "${query}"</h3>
                <p>Found relevant courses, notes, and resources!</p>
                <button onclick="this.parentElement.remove()" class="btn-gradient" style="margin-top: 1rem;">
                    Close
                </button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', resultsHtml);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            const results = document.querySelector('.search-results');
            if (results) results.remove();
        }, 3000);
    }

    // Floating Action Button
    initFAB() {
        const fab = document.getElementById('fab');
        
        if (fab) {
            fab.addEventListener('click', () => {
                // Animate FAB
                fab.style.transform = 'scale(0.9) rotate(180deg)';
                setTimeout(() => {
                    fab.style.transform = 'scale(1) rotate(360deg)';
                }, 150);

                // Show action menu (mock)
                console.log('⚡ FAB clicked! Quick actions menu would appear here.');
                
                // Scroll to top functionality
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Magnetic Button Effects
    initMagneticButtons() {
        const magneticBtns = document.querySelectorAll('.magnetic-btn');
        
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const moveX = x / rect.width * 20;
                const moveY = y / rect.height * 20;
                
                btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    // Newsletter Signup
    initNewsletterSignup() {
        const newsletterInput = document.getElementById('newsletterEmail');
        const newsletterBtn = document.querySelector('.newsletter-btn');

        if (newsletterBtn) {
            newsletterBtn.addEventListener('click', () => {
                const email = newsletterInput ? newsletterInput.value : '';
                
                if (this.validateEmail(email)) {
                    this.subscribeNewsletter(email);
                } else {
                    this.showNotification('Please enter a valid email address', 'error');
                }
            });
        }

        if (newsletterInput) {
            newsletterInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    newsletterBtn?.click();
                }
            });
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    subscribeNewsletter(email) {
        console.log(`📧 Newsletter subscription for: ${email}`);
        
        // Animate button
        const btn = document.querySelector('.newsletter-btn');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'Subscribing...';
            btn.style.transform = 'translateY(-50%) scale(0.95)';
            
            setTimeout(() => {
                btn.textContent = 'Subscribed!';
                btn.style.background = '#4ade80';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.transform = 'translateY(-50%) scale(1)';
                }, 2000);
            }, 1000);
        }

        this.showNotification('Successfully subscribed to newsletter!', 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            background: ${type === 'success' ? '#4ade80' : type === 'error' ? '#ef4444' : '#3b82f6'};
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Scroll Animations
    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.feature-card, .material-card, .tech-item, .testimonial-card');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            animationObserver.observe(el);
        });
    }

    // Mobile Menu
    initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Animate hamburger
                const spans = hamburger.querySelectorAll('span');
                if (hamburger.classList.contains('active')) {
                    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    spans.forEach(span => {
                        span.style.transform = '';
                        span.style.opacity = '';
                    });
                }
            });
        }
    }

    // Progress Circles Animation
    initProgressCircles() {
        const progressCircles = document.querySelectorAll('.progress-circle');
        
        const animateProgress = (circle) => {
            const progress = parseInt(circle.getAttribute('data-progress'));
            const circumference = 2 * Math.PI * 30; // radius = 30
            const progressBar = circle.querySelector('circle:last-child');
            
            if (progressBar) {
                const offset = circumference - (progress / 100) * circumference;
                progressBar.style.strokeDashoffset = offset;
                progressBar.style.transition = 'stroke-dashoffset 2s ease-in-out';
            }
        };

        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgress(entry.target);
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        progressCircles.forEach(circle => progressObserver.observe(circle));
    }

    // Load More Button
    initLoadMoreButton() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                // Animate button
                loadMoreBtn.style.transform = 'scale(0.95)';
                loadMoreBtn.textContent = 'Loading...';
                
                setTimeout(() => {
                    loadMoreBtn.style.transform = 'scale(1)';
                    loadMoreBtn.textContent = 'Load More Materials';
                    
                    // Mock loading more content
                    this.showNotification('More materials loaded!', 'success');
                }, 1000);
            });
        }
    }

    // Global Event Listeners
    addGlobalEventListeners() {
        // Mouse tracking for particles
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // ESC to scroll to top
            if (e.key === 'Escape') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            // "/" to focus search
            if (e.key === '/' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                document.getElementById('heroSearch')?.focus();
            }
        });

        // Parallax scrolling effect
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroCard = document.querySelector('.hero-card');
            
            if (heroCard) {
                heroCard.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            // Update tab indicator position
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
                const tabIndicator = document.querySelector('.tab-indicator');
                if (tabIndicator) {
                    const rect = activeTab.getBoundingClientRect();
                    const container = activeTab.parentElement.getBoundingClientRect();
                    tabIndicator.style.width = `${rect.width}px`;
                    tabIndicator.style.left = `${rect.left - container.left}px`;
                }
            }
        });

        // Add loading complete class
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            // Trigger hero animations
            const heroCard = document.querySelector('.hero-card');
            if (heroCard) {
                heroCard.style.animation = 'fadeInUp 1s ease-out forwards';
            }
        });
    }
}

// Initialize the application
const studyWebApp = new StudyWebApp();

// Export for potential external use
window.StudyWebApp = StudyWebApp;