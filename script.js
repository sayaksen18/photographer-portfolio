/* ===================================================================
   SHIRSHAK PAL PHOTOGRAPHY — Premium Portfolio Script
   Vanilla JS with GSAP animations and Lenis smooth scroll
   =================================================================== */

'use strict';

/* ==================== PRELOADER ==================== */
const Preloader = {
  el: document.getElementById('preloader'),
  progress: null,

  init() {
    this.progress = this.el?.querySelector('.preloader__progress');
    if (!this.el) return;
    document.body.style.overflow = 'hidden';

    let loaded = 0;
    const images = document.querySelectorAll('img');
    const total = images.length || 1;

    // Simulate progress even before images load
    const fakeProgress = setInterval(() => {
      if (loaded < 70) {
        loaded += 2;
        this.updateProgress(loaded);
      }
    }, 30);

    let imagesLoaded = 0;
    const checkComplete = () => {
      imagesLoaded++;
      loaded = Math.max(loaded, Math.round((imagesLoaded / total) * 100));
      this.updateProgress(loaded);

      if (imagesLoaded >= total) {
        clearInterval(fakeProgress);
        this.updateProgress(100);
        setTimeout(() => this.hide(), 600);
      }
    };

    images.forEach(img => {
      if (img.complete) {
        checkComplete();
      } else {
        img.addEventListener('load', checkComplete);
        img.addEventListener('error', checkComplete);
      }
    });

    // Fallback: hide after 4s max
    setTimeout(() => {
      clearInterval(fakeProgress);
      this.updateProgress(100);
      setTimeout(() => this.hide(), 300);
    }, 4000);
  },

  updateProgress(value) {
    if (this.progress) {
      this.progress.style.width = `${Math.min(value, 100)}%`;
    }
  },

  hide() {
    this.el?.classList.add('hidden');
    document.body.style.overflow = '';
    // Trigger hero animations after preloader
    setTimeout(() => {
      AnimationController.animateHero();
    }, 200);
  }
};


/* ==================== SMOOTH SCROLL (Lenis) ==================== */
const SmoothScroll = {
  instance: null,

  init() {
    if (typeof Lenis === 'undefined') return;

    this.instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    const raf = (time) => {
      this.instance.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Integrate with GSAP ScrollTrigger if available
    if (typeof gsap !== 'undefined' && gsap.ticker) {
      this.instance.on('scroll', () => {
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.update();
        }
      });

      gsap.ticker.add((time) => {
        this.instance.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    }
  },

  stop() {
    this.instance?.stop();
  },

  start() {
    this.instance?.start();
  }
};



/* ==================== NAVIGATION ==================== */
const Navigation = {
  header: null,
  toggle: null,
  mobileMenu: null,
  links: null,
  lastScroll: 0,

  init() {
    this.header = document.getElementById('header');
    this.toggle = document.getElementById('navToggle');
    this.mobileMenu = document.getElementById('mobileMenu');
    this.links = document.querySelectorAll('.mobile-menu__link, .nav__link');

    if (!this.header) return;

    // Scroll behavior
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });

    // Mobile toggle
    this.toggle?.addEventListener('click', () => this.toggleMenu());

    // Close menu on link click
    this.links.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Active section tracking
    this.trackActiveSection();
  },

  onScroll() {
    const scrollY = window.scrollY;

    // Add scrolled class
    if (scrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }

    this.lastScroll = scrollY;
  },

  toggleMenu() {
    const isOpen = this.mobileMenu.classList.contains('open');

    if (isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  },

  openMenu() {
    this.mobileMenu.classList.add('open');
    this.mobileMenu.setAttribute('aria-hidden', 'false');
    this.toggle.classList.add('active');
    this.toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    SmoothScroll.stop();
  },

  closeMenu() {
    this.mobileMenu.classList.remove('open');
    this.mobileMenu.setAttribute('aria-hidden', 'true');
    this.toggle?.classList.remove('active');
    this.toggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    SmoothScroll.start();
  },

  trackActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px'
    });

    sections.forEach(section => observer.observe(section));
  }
};


/* ==================== PORTFOLIO ==================== */
const Portfolio = {
  grid: null,
  items: null,
  filters: null,
  viewAllBtn: null,
  viewAllContainer: null,
  currentFilter: 'all',
  visibleLimit: 12,
  isExpanded: false,

  init() {
    this.grid = document.getElementById('portfolioGrid');
    this.wrapper = document.getElementById('portfolioGridWrapper');
    if (!this.grid) return;

    // Randomize items in the DOM
    let rawItems = Array.from(this.grid.querySelectorAll('.portfolio__item'));
    for (let i = rawItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rawItems[i], rawItems[j]] = [rawItems[j], rawItems[i]];
    }
    rawItems.forEach(item => this.grid.appendChild(item));

    this.items = this.grid.querySelectorAll('.portfolio__item');
    this.filters = document.querySelectorAll('.portfolio__filter');
    this.viewAllBtn = document.getElementById('portfolioViewAllBtn');
    this.viewLessBtn = document.getElementById('portfolioViewLessBtn');
    this.viewAllContainer = document.getElementById('portfolioViewAllContainer');

    // Filter click handlers
    this.filters.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        this.isExpanded = false;
        this.filterItems(filter);
        this.updateActiveFilter(btn);
      });
    });

    if (this.viewAllBtn) {
      this.viewAllBtn.addEventListener('click', () => {
        this.isExpanded = true;
        this.filterItems(this.currentFilter);
      });
    }

    if (this.viewLessBtn) {
      this.viewLessBtn.addEventListener('click', () => {
        this.isExpanded = false;
        this.filterItems(this.currentFilter);
        
        // Scroll back to top of portfolio section
        const headerHeight = document.getElementById('header')?.offsetHeight || 80;
        const targetTop = this.grid.getBoundingClientRect().top + window.scrollY - headerHeight - 40;
        if (typeof SmoothScroll !== 'undefined' && SmoothScroll.instance) {
          SmoothScroll.instance.scrollTo(targetTop, { duration: 0.8 });
        } else {
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      });
    }

    // Lightbox click
    this.items.forEach((item, index) => {
      item.addEventListener('click', () => {
        Lightbox.open(index);
      });

      // Keyboard accessibility
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          Lightbox.open(index);
        }
      });
    });
    
    // Initial filter apply to enforce limit on load
    this.filterItems('all');
  },

  filterItems(category) {
    this.currentFilter = category;
    let currentArea = 0;
    const maxArea = 12; // 4 rows * 3 cols
    let hasHiddenItems = false;

    this.items.forEach(item => {
      const itemCategory = item.dataset.category;
      let isMatch = category === 'all' || itemCategory === category;
      let shouldShow = false;

      if (isMatch) {
        shouldShow = true; // Always show matching items in the DOM
        let itemArea = 1;
        const size = item.dataset.size;
        if (size === 'large' || size === 'portrait' || size === 'landscape') {
          itemArea = 2;
        }

        if (currentArea + itemArea <= maxArea) {
          currentArea += itemArea;
        } else {
          hasHiddenItems = true;
        }
      }

      if (shouldShow) {
        const img = item.querySelector('img');
        if (img && img.getAttribute('loading') === 'lazy') {
          img.removeAttribute('loading');
        }

        if (item.classList.contains('hidden')) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
            // Already visible, ensure opacity and scale are correct just in case
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
        }
      } else {
        if (!item.classList.contains('hidden')) {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => item.classList.add('hidden'), 400);
        }
      }
    });

    if (this.viewAllContainer) {
      if (hasHiddenItems || this.isExpanded) {
        this.viewAllContainer.style.display = 'flex';
        if (this.isExpanded) {
          if (this.viewAllBtn) this.viewAllBtn.style.display = 'none';
          if (this.viewLessBtn) this.viewLessBtn.style.display = 'inline-flex';
        } else {
          if (this.viewAllBtn) this.viewAllBtn.style.display = 'inline-flex';
          if (this.viewLessBtn) this.viewLessBtn.style.display = 'none';
        }
      } else {
        this.viewAllContainer.style.display = 'none';
      }
    }

    if (this.wrapper) {
      if (hasHiddenItems && !this.isExpanded) {
        this.wrapper.classList.add('collapsed');
      } else {
        this.wrapper.classList.remove('collapsed');
      }
    }
  },

  updateActiveFilter(activeBtn) {
    this.filters.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-selected', 'true');
  },

  getVisibleItems() {
    return Array.from(this.items).filter(
      item => !item.classList.contains('hidden')
    );
  }
};


/* ==================== LIGHTBOX ==================== */
const Lightbox = {
  el: null,
  img: null,
  info: null,
  currentIndex: 0,

  init() {
    this.el = document.getElementById('lightbox');
    this.img = document.getElementById('lightboxImg');
    this.info = document.getElementById('lightboxInfo');
    if (!this.el) return;

    // Close button
    document.getElementById('lightboxClose')?.addEventListener('click', () => this.close());

    // Navigation
    document.getElementById('lightboxPrev')?.addEventListener('click', () => this.prev());
    document.getElementById('lightboxNext')?.addEventListener('click', () => this.next());

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (!this.el.classList.contains('open')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Click backdrop to close
    this.el.addEventListener('click', (e) => {
      if (e.target === this.el) this.close();
    });
  },

  open(index) {
    const visibleItems = Portfolio.getVisibleItems();
    if (!visibleItems.length) return;

    this.currentIndex = index;
    this.updateImage(visibleItems);
    this.el.classList.add('open');
    this.el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    SmoothScroll.stop();
  },

  close() {
    this.el.classList.remove('open');
    this.el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    SmoothScroll.start();
  },

  prev() {
    const items = Portfolio.getVisibleItems();
    this.currentIndex = (this.currentIndex - 1 + items.length) % items.length;
    this.updateImage(items);
  },

  next() {
    const items = Portfolio.getVisibleItems();
    this.currentIndex = (this.currentIndex + 1) % items.length;
    this.updateImage(items);
  },

  updateImage(items) {
    const item = items[this.currentIndex];
    if (!item) return;

    const img = item.querySelector('img');
    const cat = item.querySelector('.portfolio__item-cat');
    const title = item.querySelector('.portfolio__item-title');
    const desc = item.querySelector('.portfolio__item-desc');

    // Use higher res for lightbox
    const src = img.src.replace('w=600', 'w=1200').replace('w=800', 'w=1400');

    this.img.style.opacity = '0';
    setTimeout(() => {
      this.img.src = src;
      this.img.alt = img.alt;
      this.img.style.opacity = '1';
    }, 200);

    if (this.info) {
      this.info.querySelector('.lightbox__category').textContent = cat?.textContent || '';
      this.info.querySelector('.lightbox__title').textContent = title?.textContent || '';
      this.info.querySelector('.lightbox__desc').textContent = desc?.textContent || '';
    }
  }
};


/* ==================== TESTIMONIALS CAROUSEL ==================== */
const TestimonialCarousel = {
  track: null,
  cards: null,
  dots: null,
  currentIndex: 0,
  autoplayInterval: null,

  init() {
    this.track = document.getElementById('testimonialTrack');
    if (!this.track) return;

    this.cards = this.track.querySelectorAll('.testimonial-card');
    this.dots = document.querySelectorAll('.testimonials__dot');

    // Navigation buttons
    document.getElementById('testimonialPrev')?.addEventListener('click', () => this.prev());
    document.getElementById('testimonialNext')?.addEventListener('click', () => this.next());

    // Dot clicks
    this.dots.forEach((dot, i) => {
      dot.addEventListener('click', () => this.goTo(i));
    });

    // Touch/swipe support
    this.setupTouch();

    // Autoplay
    this.startAutoplay();
  },

  goTo(index) {
    this.currentIndex = index;
    this.track.style.transform = `translateX(-${index * 100}%)`;

    // Update dots
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    this.resetAutoplay();
  },

  prev() {
    const index = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
    this.goTo(index);
  },

  next() {
    const index = (this.currentIndex + 1) % this.cards.length;
    this.goTo(index);
  },

  startAutoplay() {
    this.autoplayInterval = setInterval(() => this.next(), 6000);
  },

  resetAutoplay() {
    clearInterval(this.autoplayInterval);
    this.startAutoplay();
  },

  setupTouch() {
    let startX = 0;
    let endX = 0;

    this.track.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.track.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].screenX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) this.next();
        else this.prev();
      }
    }, { passive: true });
  }
};


/* ==================== COUNTER ANIMATION ==================== */
const CounterAnimation = {
  init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  },

  animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);

      // Easing: ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }
};


/* ==================== SCROLL REVEAL ==================== */
const ScrollReveal = {
  init() {
    const elements = document.querySelectorAll('.reveal-up');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger delay for siblings
          const siblings = entry.target.parentElement.querySelectorAll('.reveal-up');
          let delay = 0;
          siblings.forEach((sibling, i) => {
            if (sibling === entry.target) delay = i * 80;
          });

          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }
};


/* ==================== GSAP ANIMATIONS ==================== */
const AnimationController = {
  init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    this.setupParallax();
    this.setupPortfolioReveal();
  },

  animateHero() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero__badge', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.2
    })
    .from('.hero__title-line', {
      opacity: 0,
      y: 60,
      duration: 1,
      stagger: 0.12
    }, '-=0.4')
    .from('.hero__subtitle', {
      opacity: 0,
      y: 30,
      duration: 0.8
    }, '-=0.5')
    .from('.hero__actions .btn', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1
    }, '-=0.4')
    .from('.hero__scroll', {
      opacity: 0,
      duration: 0.8
    }, '-=0.3')
    .from('.hero__meta-item', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1
    }, '-=0.6');
  },

  setupParallax() {
    // Hero background parallax
    gsap.to('.hero__bg-img', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  },

  setupPortfolioReveal() {
    gsap.utils.toArray('.portfolio__item').forEach((item, i) => {
      gsap.from(item, {
        opacity: 0,
        y: 60,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        delay: (i % 3) * 0.1
      });
    });
  }
};


/* ==================== CONTACT FORM ==================== */
const ContactForm = {
  form: null,

  init() {
    this.form = document.getElementById('contactForm');
    if (!this.form) return;

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Float labels
    const inputs = this.form.querySelectorAll('.form__input');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      input.addEventListener('blur', () => {
        if (!input.value) {
          input.parentElement.classList.remove('focused');
        }
      });
    });
  },

  handleSubmit(e) {
    e.preventDefault();

    const btn = this.form.querySelector('[type="submit"]');
    const btnText = btn.querySelector('span');

    // Simple validation
    const name = this.form.querySelector('#contact-name');
    const email = this.form.querySelector('#contact-email');
    const event = this.form.querySelector('#contact-event');
    const message = this.form.querySelector('#contact-message');

    if (!name.value.trim() || !email.value.trim() || !event.value || !message.value.trim()) {
      // Highlight empty required fields
      [name, email, event, message].forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = 'var(--color-error)';
          setTimeout(() => {
            field.style.borderColor = '';
          }, 2000);
        }
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      email.style.borderColor = 'var(--color-error)';
      setTimeout(() => {
        email.style.borderColor = '';
      }, 2000);
      return;
    }

    // Simulate submission
    const originalText = btnText.textContent;
    btnText.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      btnText.textContent = 'Message Sent!';
      btn.style.opacity = '1';
      btn.style.background = 'var(--color-success)';

      // Reset after 3 seconds
      setTimeout(() => {
        this.form.reset();
        btnText.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
      }, 3000);
    }, 1500);
  }
};


/* ==================== NEWSLETTER ==================== */
const Newsletter = {
  init() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const btn = form.querySelector('button');

      if (input.value.trim()) {
        btn.innerHTML = '✓';
        btn.style.background = 'var(--color-success)';
        input.value = '';
        input.placeholder = 'Subscribed!';

        setTimeout(() => {
          btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
          btn.style.background = '';
          input.placeholder = 'Your email';
        }, 3000);
      }
    });
  }
};


/* ==================== SMOOTH ANCHOR SCROLLING ==================== */
const SmoothAnchors = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const headerHeight = document.getElementById('header')?.offsetHeight || 80;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        if (SmoothScroll.instance) {
          SmoothScroll.instance.scrollTo(targetTop, { duration: 1.2 });
        } else {
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      });
    });
  }
};


/* ==================== IMAGE LAZY LOADING ==================== */
const LazyLoader = {
  init() {
    // Native lazy loading is already set via HTML attributes.
    // This adds a fade-in effect when images load.
    const images = document.querySelectorAll('img[loading="lazy"]');

    images.forEach(img => {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.6s ease';

      if (img.complete) {
        img.style.opacity = '1';
      } else {
        img.addEventListener('load', () => {
          img.style.opacity = '1';
        });
      }
    });
  }
};


/* ==================== INITIALIZE ==================== */
document.addEventListener('DOMContentLoaded', () => {
  // Prevent FOUC
  document.body.style.overflow = 'hidden';

  // Initialize all modules
  Preloader.init();
  SmoothScroll.init();
  Navigation.init();
  Portfolio.init();
  Lightbox.init();
  TestimonialCarousel.init();
  CounterAnimation.init();
  ScrollReveal.init();
  AnimationController.init();
  ContactForm.init();
  Newsletter.init();
  SmoothAnchors.init();
  LazyLoader.init();
});

// Fallback: If DOMContentLoaded already fired
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  Preloader.init();
}
