/* ============================================================
   UrbanNest — SIH26116 Interactive Script
   GSAP Animations, Tabs, Counter, Lightbox, Navigation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- NAVBAR SCROLL --- */
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --- MOBILE NAV TOGGLE --- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  /* --- SMOOTH SCROLL --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        const offset = navbar.offsetHeight + 20;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  /* --- COUNTER ANIMATION --- */
  const counters = document.querySelectorAll('.hero-stat-number');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count, 10);
      const suffix = counter.dataset.suffix || '';
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current >= target) {
          counter.textContent = target + suffix;
          return;
        }
        counter.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(updateCounter);
      };
      requestAnimationFrame(updateCounter);
    });
  };

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(animateCounters, 600);
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroObserver.observe(heroStats);

  /* --- TABS --- */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;

      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const target = document.getElementById('tab-' + tabId);
      if (target) target.classList.add('active');
    });
  });

  /* --- LIGHTBOX --- */
  const lightbox = document.getElementById('lightbox');
  const lightboxText = document.getElementById('lightboxText');
  const lightboxClose = document.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const title = item.dataset.title || 'Gallery View';
      lightboxText.textContent = title;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  /* --- GSAP ANIMATIONS --- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    /* Hero entrance */
    const heroTl = gsap.timeline({ delay: 0.3 });
    heroTl
      .from('.hero-badge', { opacity: 0, y: 20, duration: 0.6, ease: 'back.out(1.4)' })
      .from('.hero-title', { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' }, '-=0.3')
      .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .from('.hero-buttons', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.2')
      .from('.hero-stat', { opacity: 0, y: 15, duration: 0.4, stagger: 0.1, ease: 'power2.out' }, '-=0.1')
      .from('.scroll-indicator', { opacity: 0, duration: 0.5 }, '-=0.2');

    /* About section */
    gsap.from('.about-image', {
      scrollTrigger: { trigger: '.about', start: 'top 75%' },
      opacity: 0, x: -50, duration: 0.8, ease: 'power3.out'
    });
    gsap.from('.about-content', {
      scrollTrigger: { trigger: '.about', start: 'top 75%' },
      opacity: 0, x: 50, duration: 0.8, ease: 'power3.out', delay: 0.2
    });

    /* Building floors stagger */
    gsap.from('.floor', {
      scrollTrigger: { trigger: '.overview', start: 'top 60%' },
      opacity: 0, x: -30, duration: 0.4,
      stagger: { each: 0.08, from: 'end' },
      ease: 'back.out(1.2)'
    });

    /* Feature cards */
    gsap.from('.feature-card', {
      scrollTrigger: { trigger: '.features-grid', start: 'top 75%' },
      opacity: 0, y: 30, scale: 0.95, duration: 0.5,
      stagger: { each: 0.1, grid: 'auto', from: 'start' },
      ease: 'back.out(1.4)'
    });

    /* Gallery items */
    gsap.from('.gallery-item', {
      scrollTrigger: { trigger: '.gallery-grid', start: 'top 75%' },
      opacity: 0, scale: 0.9, duration: 0.5,
      stagger: 0.1, ease: 'power2.out'
    });

    /* Sustainability cards */
    gsap.from('.sustain-card', {
      scrollTrigger: { trigger: '.sustain-grid', start: 'top 75%' },
      opacity: 0, y: 25, duration: 0.5,
      stagger: 0.12, ease: 'power2.out'
    });

    /* Deliverables timeline */
    gsap.from('.deliverable-item', {
      scrollTrigger: { trigger: '.deliverables-timeline', start: 'top 75%' },
      opacity: 0, x: -20, duration: 0.5,
      stagger: 0.15, ease: 'power2.out'
    });

    /* Team cards */
    gsap.from('.team-card', {
      scrollTrigger: { trigger: '.team-grid', start: 'top 75%' },
      opacity: 0, y: 30, scale: 0.95, duration: 0.5,
      stagger: { each: 0.1, from: 'start' },
      ease: 'back.out(1.4)'
    });

    /* Section headers */
    gsap.utils.toArray('.section-label, .section-title, .section-desc').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        opacity: 0, y: 15, duration: 0.5, ease: 'power2.out'
      });
    });

    /* Parallax glow on hero */
    gsap.to('.hero-glow', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', scrub: true }
    });
    gsap.to('.hero-glow-2', {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', scrub: true }
    });
  }

  /* --- ACTIVE NAV HIGHLIGHT --- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navAnchors.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + id) {
            a.style.color = '#fff';
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* --- FLOOR HOVER TOOLTIP --- */
  document.querySelectorAll('.floor').forEach(floor => {
    floor.addEventListener('mouseenter', () => {
      floor.style.background = floor.classList.contains('floor-residential')
        ? 'rgba(15, 52, 96, 0.85)'
        : floor.classList.contains('floor-commercial')
        ? 'rgba(201, 168, 76, 0.3)'
        : 'rgba(233, 69, 96, 0.25)';
    });
    floor.addEventListener('mouseleave', () => {
      floor.style.background = '';
    });
  });

});
