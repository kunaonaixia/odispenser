document.addEventListener('DOMContentLoaded', () => {
  /* ──────────────────────────────────────────────
     GSAP Setup
  ────────────────────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger);

  // Force GPU compositing for all GSAP transforms
  gsap.config({ force3D: true });

  /* ──────────────────────────────────────────────
     1. Hero Entrance Animation (GSAP Timeline)
  ────────────────────────────────────────────── */
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl
    .from('.hero-badge', { y: 30, opacity: 0, duration: 0.8 })
    .from('.hero-title', { y: 40, opacity: 0, duration: 1 }, '-=0.5')
    .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.btn-primary', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4');

  /* ──────────────────────────────────────────────
     2. Section Reveal on Scroll (ScrollTrigger)
  ────────────────────────────────────────────── */
  gsap.utils.toArray('.section').forEach(section => {
    // Animate the section header
    const header = section.querySelector('.section-header');
    if (header) {
      gsap.from(header, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }

    // Animate cards/items inside each section with stagger
    const cards = section.querySelectorAll('.glass-card, .h-card, .timeline-item, .accordion-item, .flip-container');
    if (cards.length) {
      gsap.from(cards, {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      });
    }
  });

  // Footer reveal
  gsap.from('.soft-footer', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.soft-footer',
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  });

  /* ──────────────────────────────────────────────
     3. Card Hover Animations (GSAP)
  ────────────────────────────────────────────── */
  document.querySelectorAll('.glass-card, .h-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -8, boxShadow: '0 24px 60px rgba(45,58,53,0.14)', duration: 0.35, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, boxShadow: '0 16px 40px rgba(45,58,53,0.08)', duration: 0.35, ease: 'power2.out' });
    });
  });

  // Card image scale on hover
  document.querySelectorAll('.card-image-wrap img, .h-card-image img').forEach(img => {
    const parent = img.closest('.glass-card') || img.closest('.h-card');
    if (!parent) return;
    parent.addEventListener('mouseenter', () => {
      gsap.to(img, { scale: 1.06, duration: 0.5, ease: 'power2.out' });
    });
    parent.addEventListener('mouseleave', () => {
      gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.out' });
    });
  });

  /* ──────────────────────────────────────────────
     4. Sticky Nav & Scroll Spy
  ────────────────────────────────────────────── */
  gsap.registerPlugin(ScrollToPlugin);

  const nav = document.querySelector('.glass-nav');
  const navPills = document.querySelectorAll('.nav-pill');
  const sectionIds = ['pengenalan', 'persiapan', 'jenis', 'alur', 'pemulihan', 'faq'];

  // Nav background on scroll
  ScrollTrigger.create({
    start: 50,
    onUpdate: (self) => {
      nav.classList.toggle('scrolled', self.scroll() > 50);
    }
  });

  // Scroll-spy: one ScrollTrigger per section, covering from its top to its bottom
  sectionIds.forEach(id => {
    const section = document.getElementById(id);
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActiveNav(id),
      onEnterBack: () => setActiveNav(id),
      onLeave: () => {},       // handled by next section's onEnter
      onLeaveBack: () => {},   // handled by prev section's onEnterBack
    });
  });

  function setActiveNav(id) {
    navPills.forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-target') === id);
    });
  }

  // Click-to-scroll with GSAP ScrollToPlugin
  navPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetId = pill.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (target) {
        // Immediately set active state
        setActiveNav(targetId);
        gsap.to(window, {
          scrollTo: { y: target, offsetY: 80 },
          duration: 0.45,
          ease: 'power3.out'
        });
      }
    });
  });

  /* ──────────────────────────────────────────────
     5. Flip Cards (GSAP 3D)
  ────────────────────────────────────────────── */
  document.querySelectorAll('.flip-container').forEach(container => {
    let isFlipped = false;

    const toggle = () => {
      isFlipped = !isFlipped;
      gsap.to(container.querySelector('.flipper'), {
        rotateY: isFlipped ? 180 : 0,
        duration: 0.8,
        ease: 'power2.inOut'
      });
    };

    container.addEventListener('click', toggle);
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  /* ──────────────────────────────────────────────
     6. FAQ Accordion (GSAP height animation)
  ────────────────────────────────────────────── */
  document.querySelectorAll('.accordion-item').forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    const inner = item.querySelector('.accordion-inner');

    // Ensure content starts closed
    gsap.set(content, { height: 0, overflow: 'hidden' });

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      document.querySelectorAll('.accordion-item.active').forEach(openItem => {
        if (openItem === item) return;
        openItem.classList.remove('active');
        gsap.to(openItem.querySelector('.accordion-content'), { height: 0, duration: 0.4, ease: 'power2.inOut' });
      });

      if (!isActive) {
        item.classList.add('active');
        gsap.to(content, { height: inner.offsetHeight, duration: 0.5, ease: 'power2.out' });
      } else {
        item.classList.remove('active');
        gsap.to(content, { height: 0, duration: 0.4, ease: 'power2.inOut' });
      }
    });
  });

  /* ──────────────────────────────────────────────
     7. Carousel (GSAP-powered sliding)
  ────────────────────────────────────────────── */
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('cPrev');
  const nextBtn = document.getElementById('cNext');
  const dotsContainer = document.getElementById('cDots');
  const slides = Array.from(track.children);

  if (slides.length > 0) {
    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    const goToSlide = (index) => {
      if (index < 0 || index >= slides.length) return;
      currentIndex = index;

      // GSAP-powered slide transition
      gsap.to(track, {
        xPercent: -currentIndex * 100,
        duration: 0.7,
        ease: 'power2.out'
      });

      dots.forEach(d => d.classList.remove('active'));
      dots[currentIndex].classList.add('active');

      gsap.to(prevBtn, { opacity: currentIndex === 0 ? 0.4 : 1, duration: 0.3 });
      prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';

      gsap.to(nextBtn, { opacity: currentIndex === slides.length - 1 ? 0.4 : 1, duration: 0.3 });
      nextBtn.style.pointerEvents = currentIndex === slides.length - 1 ? 'none' : 'auto';
    };

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Touch/Drag
    track.addEventListener('pointerdown', (e) => {
      isDragging = true;
      startX = e.clientX;
      gsap.killTweensOf(track); // stop any running animation
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const diff = e.clientX - startX;
      const basePercent = -currentIndex * 100;
      const dragPercent = (diff / track.offsetWidth) * 100;
      gsap.set(track, { xPercent: basePercent + dragPercent });
    });

    window.addEventListener('pointerup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const diff = e.clientX - startX;

      if (Math.abs(diff) > window.innerWidth * 0.15) {
        goToSlide(diff > 0 ? currentIndex - 1 : currentIndex + 1);
      } else {
        goToSlide(currentIndex); // snap back
      }
    });

    goToSlide(0);
  }

  /* ──────────────────────────────────────────────
     8. Timeline dot pulse animation
  ────────────────────────────────────────────── */
  gsap.utils.toArray('.timeline-dot').forEach(dot => {
    gsap.fromTo(dot, 
      { boxShadow: '0 0 0 4px rgba(55,198,172,0.2)' },
      {
        boxShadow: '0 0 0 10px rgba(55,198,172,0)',
        duration: 1.5,
        repeat: -1,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: dot,
          start: 'top 80%',
          toggleActions: 'play pause resume pause'
        }
      }
    );
  });
});
