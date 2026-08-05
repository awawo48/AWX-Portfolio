/* ============================================
   AWX Visual Portfolio — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Cursor Glow Follow ----
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateGlow() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }

    // ---- Navigation Scroll Effect ----
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
        lastScroll = currentScroll;
    });

    // ---- Mobile Menu Toggle ----
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('mobile-menu--open');
            navToggle.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('mobile-menu--open') ? 'hidden' : '';
        });

        // Close mobile menu when a link is clicked
        mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('mobile-menu--open');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ---- Smooth scroll for nav links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Hero Stat Counter Animation ----
    const statNumbers = document.querySelectorAll('.hero__stat-number[data-count]');

    function animateCounter(el) {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(ease * target);
            el.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    // ---- Scroll Reveal / Intersection Observer ----
    const revealElements = document.querySelectorAll(
        '.section-header, .about__grid, .showreel__player, .work__card, .skills__card, .tools, .workspace__content, .social__card, .contact__grid'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for grid items
                const delay = entry.target.classList.contains('work__card') ||
                              entry.target.classList.contains('skills__card') ||
                              entry.target.classList.contains('social__card')
                    ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100
                    : 0;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---- Stat Counter Observer ----
    const statsSection = document.querySelector('.hero__stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(el => animateCounter(el));
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // ---- Tool Progress Bars Animation ----
    const toolBars = document.querySelectorAll('.tools__item-bar');
    const toolsSection = document.querySelector('.tools');
    if (toolsSection) {
        const toolsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    toolBars.forEach((bar, i) => {
                        setTimeout(() => {
                            bar.classList.add('animated');
                        }, i * 150);
                    });
                    toolsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        toolsObserver.observe(toolsSection);
    }

    // ---- Work Filter Functionality ----
    const workTabs = document.querySelectorAll('.work-tab');
    const workItems = document.querySelectorAll('.work-item');

    if (workTabs.length && workItems.length) {
        workTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                workTabs.forEach(t => t.classList.remove('work-tab--active'));
                tab.classList.add('work-tab--active');

                const filter = tab.dataset.filter;

                workItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.classList.remove('work-item--hidden');
                    } else {
                        item.classList.add('work-item--hidden');
                    }
                });
            });
        });
    }

    // ---- Showreel Play Overlay ----
    const playOverlay = document.getElementById('playOverlay');
    if (playOverlay) {
        playOverlay.addEventListener('click', () => {
            playOverlay.classList.add('hidden');
            const iframe = playOverlay.parentElement.querySelector('iframe');
            if (iframe && !iframe.src.includes('autoplay=1')) {
                iframe.src += '?autoplay=1';
            }
        });
    }

    // ---- Contact Form Handler ----
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const project = document.getElementById('project')?.value || 'General Inquiry';
            const message = document.getElementById('message')?.value || '';

            // Construct real mailto URL to awxfilm@gmail.com
            const subject = encodeURIComponent(`[Portfolio Inquiry] ${project} - ${name}`);
            const body = encodeURIComponent(
                `Name: ${name}\n` +
                `Email: ${email}\n` +
                `Project Type: ${project}\n\n` +
                `Message:\n${message}`
            );

            const mailtoUrl = `mailto:awxfilm@gmail.com?subject=${subject}&body=${body}`;

            // Trigger real email client
            window.location.href = mailtoUrl;

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = `
                <span>Opening Email App... ✓</span>
            `;
            submitBtn.style.background = '#ffffff';
            submitBtn.style.color = '#000000';

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.style.color = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // ---- Hero Particles ----
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 3 + 1;
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 6 + 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 4}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // ---- Active Nav Link Highlight ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

    function updateActiveLink() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${id}`) {
                        link.style.color = 'var(--text-primary)';
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // ---- Video Sliders ----
    function initSlider(trackId, prevBtnId, nextBtnId) {
        const track = document.getElementById(trackId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);

        if (!track || !prevBtn || !nextBtn) return;

        const scrollAmount = 400;

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    initSlider('cinematicTrack', 'cinematicPrev', 'cinematicNext');
    initSlider('shortformTrack', 'shortformPrev', 'shortformNext');

    // ---- Video Modal Popup ----
    const videoModal = document.getElementById('videoModal');
    const videoModalIframe = document.getElementById('videoModalIframe');
    const videoModalClose = document.getElementById('videoModalClose');
    const videoModalBackdrop = document.getElementById('videoModalBackdrop');

    function openVideoModal(url) {
        if (!videoModal || !videoModalIframe) return;
        const autoUrl = url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`;
        videoModalIframe.src = autoUrl;
        videoModal.classList.add('video-modal--open');
        document.body.style.overflow = 'hidden';
    }

    function closeVideoModal() {
        if (!videoModal || !videoModalIframe) return;
        videoModal.classList.remove('video-modal--open');
        videoModalIframe.src = '';
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.video-card__play[data-video]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const videoUrl = btn.dataset.video;
            if (videoUrl) openVideoModal(videoUrl);
        });
    });

    if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
    if (videoModalBackdrop) videoModalBackdrop.addEventListener('click', closeVideoModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal && videoModal.classList.contains('video-modal--open')) {
            closeVideoModal();
        }
    });
});
