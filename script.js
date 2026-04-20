/* =========================================
   Code Carnage 2.0 — JavaScript
   Zenith-Style Timeline, Scroll Animations,
   FAQ Accordion, Nav Effects
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // Intersection Observer for scroll animations
    // =========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const parent = entry.target.parentElement;
                const siblings = [...parent.querySelectorAll('.animate-on-scroll')];
                const idx = siblings.indexOf(entry.target);

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 60);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // =========================================
    // Zenith-Style Timeline — Scroll Progress + Event Reveals
    // =========================================
    const timelineSection = document.querySelector('.timeline-zenith');
    const timelineProgress = document.querySelector('.timeline-track-progress');
    const timelineEvents = document.querySelectorAll('.tl-event');

    if (timelineSection && timelineProgress) {
        function updateTimeline() {
            const sectionRect = timelineSection.getBoundingClientRect();
            const sectionTop = sectionRect.top;
            const sectionHeight = sectionRect.height;
            const windowHeight = window.innerHeight;

            // Calculate how far through the section we've scrolled
            const scrollStart = windowHeight * 0.3;
            const scrollProgress = (scrollStart - sectionTop) / (sectionHeight);
            const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

            // Update the progress line height
            timelineProgress.style.height = (clampedProgress * 100) + '%';

            // Reveal events based on scroll position
            timelineEvents.forEach((event, i) => {
                const eventRect = event.getBoundingClientRect();
                const eventMiddle = eventRect.top + eventRect.height * 0.3;

                if (eventMiddle < windowHeight * 0.8) {
                    // Stagger the reveal slightly
                    setTimeout(() => {
                        event.classList.add('tl-visible');
                    }, 50);
                }
            });

            requestAnimationFrame(updateTimeline);
        }

        requestAnimationFrame(updateTimeline);
    }

    // =========================================
    // Navbar scroll effect
    // =========================================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // =========================================
    // FAQ Accordion
    // =========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // =========================================
    // Smooth scroll for anchor links
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =========================================
    // Stat counter animation
    // =========================================
    const statNumbers = document.querySelectorAll('.stat-mega-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent.trim();

                // Detect currency prefix
                let prefix = '';
                let rawNum = text;
                if (text.startsWith('₹')) {
                    prefix = '₹';
                    rawNum = text.slice(1);
                } else if (text.startsWith('$')) {
                    prefix = '$';
                    rawNum = text.slice(1);
                }

                const numericValue = parseInt(rawNum.replace(/[^0-9]/g, ''), 10);

                if (!isNaN(numericValue) && numericValue > 0) {
                    let startTime = null;
                    const duration = 2000;

                    const animate = (currentTime) => {
                        if (!startTime) startTime = currentTime;
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(eased * numericValue);

                        el.textContent = prefix + current.toLocaleString();

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            el.textContent = text; // restore original
                        }
                    };

                    requestAnimationFrame(animate);
                }

                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    // =========================================
    // Parallax effect on hero glows
    // =========================================
    const hero = document.querySelector('.hero');
    const heroGlows = document.querySelectorAll('.hero-glow');

    if (hero && heroGlows.length > 0) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            heroGlows.forEach((glow, i) => {
                const factor = (i + 1) * 15;
                glow.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
                glow.style.transition = 'transform 0.3s ease-out';
            });
        });
    }

    // =========================================
    // Subtle tilt on prize cards
    // =========================================
    document.querySelectorAll('.prize-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const tiltX = (y - 0.5) * 4;
            const tiltY = (x - 0.5) * -4;

            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
});
