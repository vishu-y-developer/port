document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Mouse-Reactive Ambient Glow (Optimized) ---
    const cards = document.querySelectorAll('.glass-panel, .skill-card, .service-card, .project-card, .testimonial-card, .view-all-card');
    
    // Create an observer to only track mouse over visible cards
    const cardVisibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('glow-active');
            } else {
                entry.target.classList.remove('glow-active');
            }
        });
    }, { threshold: 0 });

    cards.forEach(card => cardVisibilityObserver.observe(card));

    let mouseX = 0, mouseY = 0;
    let isTicking = false;

    document.body.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isTicking) {
            window.requestAnimationFrame(() => {
                // Only update cards currently in the viewport
                document.querySelectorAll('.glow-active').forEach(card => {
                    const rect = card.getBoundingClientRect();
                    // Check if mouse is actually near the card (e.g. within 500px) to save performance
                    const distY = Math.abs((rect.top + rect.height/2) - mouseY);
                    if(distY < window.innerHeight) {
                        const x = mouseX - rect.left;
                        const y = mouseY - rect.top;
                        card.style.setProperty('--mouse-x', `${x}px`);
                        card.style.setProperty('--mouse-y', `${y}px`);
                    }
                });
                isTicking = false;
            });
            isTicking = true;
        }
    });

    // --- 2. Smooth Scroll & Navbar Blur (Optimized) ---
    const navbar = document.querySelector('.navbar');
    let scrollTicking = false;
    
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // Smooth anchor scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- 3. Intersection Observer (Staggered Reveals - Optimized) ---
    const revealElements = document.querySelectorAll('.reveal-up, .fade-up, .reveal-left, .reveal-right');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Essential for performance
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. Mobile Navigation Toggle ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if(navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
});
