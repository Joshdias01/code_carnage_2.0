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

    // =========================================
    // Zenith-Style 3D Tilt + Mouse Glow on Organizer Cards
    // =========================================
    function initZenithTilt(selector) {
        document.querySelectorAll(selector).forEach(card => {
            const glowEl = card.querySelector('.zenith-card-glow, .sponsor-card-glow');

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;

                // 3D tilt — stronger than prize cards for dramatic Zenith feel
                const tiltX = (y - 0.5) * -10;
                const tiltY = (x - 0.5) * 10;

                card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;

                // Move glow to mouse position
                if (glowEl) {
                    glowEl.style.left = e.clientX - rect.left + 'px';
                    glowEl.style.top = e.clientY - rect.top + 'px';
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
                if (glowEl) {
                    glowEl.style.opacity = '0';
                }
            });

            card.addEventListener('mouseenter', () => {
                if (glowEl) {
                    glowEl.style.opacity = '1';
                }
            });
        });
    }

    // Init tilt for organizer cards
    initZenithTilt('.organizer-card.zenith-card');

    // Init tilt for sponsor cards
    initZenithTilt('.sponsor-card');

    // =========================================
    // Gallery — Cinematic Film Reel
    // =========================================
    const galleryBtn = document.getElementById('gallery-btn');
    const gallerySection = document.getElementById('gallery');
    const reelTrack = document.getElementById('film-reel-track');
    const reelScroll = document.getElementById('film-reel-scroll');

    // List every image in the gallery folder.
    // Add more filenames here whenever new photos are dropped in.
    const galleryImages = [
        'gallery/1.JPG',
        'gallery/2.JPG',
        'gallery/3.JPG',
        'gallery/4.JPG',
        'gallery/5.JPG',
        'gallery/6.JPG',
        'gallery/7.JPG',
        'gallery/8.JPG',
        'gallery/9.JPG',
        'gallery/10.JPG',
        'gallery/11.JPG',
        'gallery/12.JPG',
        'gallery/13.JPG',
        'gallery/14.JPG',
        'gallery/15.JPG',
        'gallery/16.JPG',
        'gallery/17.JPG',
        'gallery/18.JPG',
        'gallery/19.JPG',

    ];

    let galleryBuilt = false;
    let galleryIsOpen = false;

    // Build the film strip (original + clone for seamless loop)
    function buildFilmReel() {
        if (galleryBuilt || galleryImages.length === 0) return;
        galleryBuilt = true;

        // We need a fixed height; images fill it preserving aspect ratio.
        // Width per frame is derived once the image loads.
        const FRAME_H = 320; // px — matches CSS

        function makeFrame(src) {
            const frame = document.createElement('div');
            frame.className = 'film-frame';
            frame.style.height = FRAME_H + 'px';
            // Start with a neutral width; update once img is loaded
            frame.style.width = Math.round(FRAME_H * 1.5) + 'px';

            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Hackathon moment';
            img.loading = 'lazy';
            img.decoding = 'async';

            img.onload = () => {
                // Compute natural aspect ratio and set frame width
                const ratio = img.naturalWidth / img.naturalHeight;
                frame.style.width = Math.round(FRAME_H * ratio) + 'px';
            };

            frame.appendChild(img);
            return frame;
        }

        // Build original set
        galleryImages.forEach(src => reelTrack.appendChild(makeFrame(src)));

        // Clone the whole set to make seamless infinite loop
        // (CSS animation translates -50% so we need double the content)
        galleryImages.forEach(src => reelTrack.appendChild(makeFrame(src)));
    }

    // Toggle gallery open / closed
    function toggleGallery(e) {
        e.preventDefault();

        galleryIsOpen = !galleryIsOpen;

        if (galleryIsOpen) {
            // Build reel on first open (lazy)
            buildFilmReel();

            gallerySection.classList.add('gallery-open');
            gallerySection.removeAttribute('aria-hidden');
            galleryBtn.textContent = 'Close Gallery';

            // Smooth scroll to gallery after it starts expanding
            setTimeout(() => {
                gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 120);
        } else {
            gallerySection.classList.remove('gallery-open');
            gallerySection.setAttribute('aria-hidden', 'true');
            galleryBtn.textContent = 'Gallery';
        }
    }

    if (galleryBtn && gallerySection && reelTrack) {
        galleryBtn.addEventListener('click', toggleGallery);
    }

    // ---- Drag / click-drag to scroll ----
    if (reelScroll) {
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;

        reelScroll.addEventListener('mousedown', (e) => {
            isDragging = true;
            reelScroll.classList.add('is-dragging');
            reelTrack.classList.add('paused');
            startX = e.pageX - reelScroll.offsetLeft;
            scrollLeft = reelScroll.scrollLeft;
            e.preventDefault();
        });

        reelScroll.addEventListener('mouseleave', () => {
            isDragging = false;
            reelScroll.classList.remove('is-dragging');
            reelTrack.classList.remove('paused');
        });

        reelScroll.addEventListener('mouseup', () => {
            isDragging = false;
            reelScroll.classList.remove('is-dragging');
            // Resume auto scroll only if user isn't hovering a frame
            reelTrack.classList.remove('paused');
        });

        reelScroll.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const x = e.pageX - reelScroll.offsetLeft;
            const walk = (x - startX) * 1.6; // drag speed multiplier
            reelScroll.scrollLeft = scrollLeft - walk;
        });

        // Touch support
        let touchStartX = 0;
        let touchScrollLeft = 0;

        reelScroll.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].pageX;
            touchScrollLeft = reelScroll.scrollLeft;
            reelTrack.classList.add('paused');
        }, { passive: true });

        reelScroll.addEventListener('touchmove', (e) => {
            const dx = touchStartX - e.touches[0].pageX;
            reelScroll.scrollLeft = touchScrollLeft + dx;
        }, { passive: true });

        reelScroll.addEventListener('touchend', () => {
            reelTrack.classList.remove('paused');
        }, { passive: true });

        // Pause animation while mouse is over the strip
        reelScroll.addEventListener('mouseenter', () => {
            reelTrack.classList.add('paused');
        });
        reelScroll.addEventListener('mouseleave', () => {
            if (!isDragging) reelTrack.classList.remove('paused');
        });
    }

    // =========================================
    // 24-Hour Hackathon Countdown Timer
    // =========================================
    (function () {
        const DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in ms

        // ─────────────────────────────────────────────────────────────────
        // HACKATHON_START_TIME — Unix timestamp (ms) of when the timer
        // was officially started.  This value is shared by ALL devices.
        //
        // HOW TO UPDATE:
        //   1. Open the site with ?admin=cc2admin
        //   2. Click "▶ Start Timer" — your browser console will print
        //      the exact timestamp to paste here.
        //   3. Replace the number below, save, and redeploy to Vercel.
        //
        // Current value = 2026-04-29 10:30 AM IST (05:00 UTC)
        // ─────────────────────────────────────────────────────────────────
        const HACKATHON_START_TIME = 1777442400000; // ← 2026-04-29 11:30 AM IST | update if restarted

        const timerEl = document.getElementById('hackathon-timer');
        const hoursEl = document.getElementById('timer-hours');
        const minutesEl = document.getElementById('timer-minutes');
        const secondsEl = document.getElementById('timer-seconds');
        const dotEl = document.getElementById('timer-status-dot');
        const labelTextEl = document.getElementById('timer-label-text');
        const adminPanel = document.getElementById('timer-admin-panel');
        const btnStart = document.getElementById('timer-btn-start');
        const btnReset = document.getElementById('timer-btn-reset');

        if (!timerEl) return;

        let tickInterval = null;

        // ---- Helpers ----
        function pad(n) { return String(n).padStart(2, '0'); }

        /** Animate a digit change with a small flip */
        function setDigit(el, val) {
            const str = pad(val);
            if (el.textContent === str) return;
            el.classList.add('flip');
            setTimeout(() => {
                el.textContent = str;
                el.classList.remove('flip');
            }, 150);
        }

        /** Render remaining time from ms */
        function render(remainMs) {
            const totalSec = Math.max(0, Math.floor(remainMs / 1000));
            const h = Math.floor(totalSec / 3600);
            const m = Math.floor((totalSec % 3600) / 60);
            const s = totalSec % 60;
            setDigit(hoursEl, h);
            setDigit(minutesEl, m);
            setDigit(secondsEl, s);
        }

        /** Mark the timer as finished */
        function markFinished() {
            clearInterval(tickInterval);
            tickInterval = null;
            timerEl.classList.remove('timer-running');
            timerEl.classList.add('timer-finished');
            dotEl.className = 'timer-label-dot finished';
            labelTextEl.textContent = 'Time\'s Up!';
            if (btnStart) btnStart.textContent = '▶ Start Timer';
            render(0);
        }

        /** Start the live countdown from HACKATHON_START_TIME */
        function startLiveTimer(startTime) {
            timerEl.classList.add('timer-running');
            timerEl.classList.remove('timer-finished');
            dotEl.className = 'timer-label-dot running';
            labelTextEl.textContent = 'Hackathon Live';
            if (btnStart) { btnStart.textContent = '⏸ Running…'; btnStart.disabled = true; }

            tickInterval = setInterval(() => {
                const remain = DURATION_MS - (Date.now() - startTime);
                if (remain <= 0) { markFinished(); return; }
                render(remain);
            }, 500);

            // Render immediately so there's no 500ms blank
            render(Math.max(0, DURATION_MS - (Date.now() - startTime)));
        }

        /** On page load — always sync from the hardcoded start time */
        function restoreTimer() {
            // 0 means timer hasn't been configured yet — show idle state
            if (!HACKATHON_START_TIME) return;

            const elapsed = Date.now() - HACKATHON_START_TIME;
            if (elapsed < 0) {
                // Hackathon hasn't begun yet — show 24:00:00 static
                return;
            }
            if (elapsed >= DURATION_MS) {
                markFinished();
            } else {
                startLiveTimer(HACKATHON_START_TIME);
            }
        }

        // ---- Admin panel unlock ----
        // Two ways to enter admin mode:
        //   1. URL param:  yoursite.com/?admin=cc2admin
        //   2. Keyboard:   Ctrl + Shift + A

        function unlockAdmin() {
            adminPanel.classList.add('admin-visible');
            if (!document.getElementById('timer-admin-badge-el')) {
                const badge = document.createElement('span');
                badge.className = 'timer-admin-badge';
                badge.id = 'timer-admin-badge-el';
                badge.textContent = 'admin';
                labelTextEl.parentNode.appendChild(badge);
            }
        }

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('admin') === 'cc2admin') unlockAdmin();

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') unlockAdmin();
        });

        // ---- Admin button handlers ----
        if (btnStart) {
            btnStart.addEventListener('click', () => {
                const now = Date.now();
                // Print to console so admin can copy the value into HACKATHON_START_TIME
                console.log('%c⏱ Timer started!', 'color:#0f0;font-size:14px;font-weight:bold;');
                console.log('%cPaste this as HACKATHON_START_TIME in script.js, then redeploy:\n\n  const HACKATHON_START_TIME = ' + now + ';', 'color:#0ff;font-size:13px;');
                alert(
                    'Timer started!\n\n' +
                    'To make ALL devices see this timer, update script.js:\n\n' +
                    '  HACKATHON_START_TIME = ' + now + '\n\n' +
                    'Then redeploy to Vercel. (Value also logged to console.)'
                );
                startLiveTimer(now);
            });
        }

        if (btnReset) {
            btnReset.addEventListener('click', () => {
                if (!confirm('Reset the hackathon timer? This cannot be undone.')) return;

                clearInterval(tickInterval);
                tickInterval = null;

                timerEl.classList.remove('timer-running', 'timer-finished');
                dotEl.className = 'timer-label-dot';
                labelTextEl.textContent = 'Hackathon Timer';
                btnStart.textContent = '▶ Start Timer';
                btnStart.disabled = false;

                hoursEl.textContent = '24';
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';
            });
        }

        // ---- Initialise (runs for every visitor on every device) ----
        restoreTimer();
    })();

});
