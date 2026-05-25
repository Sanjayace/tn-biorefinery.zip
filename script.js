/* =====================================================
   TN BioRefinery — JavaScript Interactions
   ===================================================== */

'use strict';

/* ===== NAVBAR SCROLL BEHAVIOUR ===== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const navToggle = document.getElementById('navToggle');
const navLinksMenu = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
});

navToggle.addEventListener('click', () => {
  navLinksMenu.classList.toggle('open');
});

// Close mobile menu on link click
navLinksMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksMenu.classList.remove('open');
  });
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

/* ===== HERO PARTICLES ===== */
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const left = Math.random() * 100;
    const duration = 8 + Math.random() * 12;
    const delay = Math.random() * 8;
    const size = 2 + Math.random() * 4;
    p.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      opacity: ${0.3 + Math.random() * 0.4};
    `;
    container.appendChild(p);
  }
}
createParticles();

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el, target, suffix, duration = 2000) {
  const start = 0;
  const startTime = performance.now();
  const isFloat = String(target).includes('.');
  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    const value = start + (target - start) * ease;
    if (isFloat) {
      el.textContent = value.toFixed(2) + suffix;
    } else {
      el.textContent = Math.floor(value) + suffix;
    }
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ===== INTERSECTION OBSERVER ===== */
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

// Hero stat counters
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix, 1800);
      heroObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stat-value').forEach(el => {
  heroObserver.observe(el);
});

// Output section counters
const outputObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      animateCounter(el, target, '', 2000);
      outputObserver.unobserve(el);
    }
  });
}, observerOptions);

document.querySelectorAll('.oc-value').forEach(el => {
  outputObserver.observe(el);
});

// Surplus bar animation
const surplusObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = document.getElementById('surplusBarFill');
      if (bar) {
        setTimeout(() => { bar.style.width = '51%'; }, 200);
      }
      surplusObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

const surplusEl = document.querySelector('.finance-surplus');
if (surplusEl) surplusObserver.observe(surplusEl);

// Donut chart animations
function animateDonut(id, percentage, totalCircumference = 301.6) {
  const el = document.getElementById(id);
  if (!el) return;
  const filled = (percentage / 100) * totalCircumference;
  el.style.strokeDasharray = `${filled} ${totalCircumference}`;
}

const donutObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        animateDonut('revenueDonut', 97.3);
        animateDonut('costDonut', 50.2);
        animateDonut('marginDonut', 51);
      }, 300);
      donutObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

const donutRow = document.querySelector('.finance-donut-row');
if (donutRow) donutObserver.observe(donutRow);

// General reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Stagger children of grid/layout containers
function staggerReveal(parentSelector, childSelector) {
  const parents = document.querySelectorAll(parentSelector);
  parents.forEach(parent => {
    const children = parent.querySelectorAll(childSelector);
    children.forEach((child, index) => {
      child.style.transitionDelay = `${index * 0.1}s`;
      child.classList.add('reveal');
      revealObserver.observe(child);
    });
  });
}

// Add reveal classes to various elements
document.querySelectorAll('.overview-card, .agro-feature, .agro-stat-card, .pipeline-step, .po-card, .logistics-card, .welfare-step, .finance-block, .risk-card, .mill-card, .fih-item, .output-primary, .tl-item').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 0.1}s`;
  revealObserver.observe(el);
});

document.querySelectorAll('.reveal-img').forEach(el => {
  revealObserver.observe(el);
});

/* ===== SMOOTH SECTION TRANSITIONS ===== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});

/* ===== HUB DOT TOOLTIPS ===== */
document.querySelectorAll('.hub-dot').forEach((dot, index) => {
  const labels = [
    'Northern Hub — Villupuram',
    'Northwest Hub — Dharmapuri',
    'Northeast Hub — Cuddalore',
    'Central-North Hub — Salem',
    'East Hub — Nagapattinam',
    'West Hub — Erode',
    'Central Hub — Tiruchirappalli',
    'Southwest Hub — Coimbatore',
    'Southeast Hub — Thanjavur',
    'South-Central Hub — Pudukkottai',
    'SW Hub — Tirunelveli',
    'SE Hub — Ramanathapuram',
    'South Hub — Thoothukudi',
    'Southern Hub — Kanyakumari'
  ];
  
  const tooltip = document.createElement('div');
  tooltip.style.cssText = `
    position: absolute;
    background: rgba(4,13,26,0.92);
    border: 1px solid rgba(34,197,94,0.4);
    color: #fff;
    padding: 0.4rem 0.8rem;
    border-radius: 8px;
    font-size: 0.72rem;
    font-weight: 600;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: 100;
    transform: translateX(-50%) translateY(-120%);
    left: 50%;
    top: 0;
    backdrop-filter: blur(8px);
  `;
  tooltip.textContent = labels[index] || `Hub ${index + 1}`;
  dot.style.position = 'absolute';
  dot.appendChild(tooltip);
  
  dot.addEventListener('mouseenter', () => { tooltip.style.opacity = '1'; });
  dot.addEventListener('mouseleave', () => { tooltip.style.opacity = '0'; });
});

/* ===== SECTION HEADER REVEAL ===== */
const headerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      headerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.section-header').forEach(header => {
  header.style.opacity = '0';
  header.style.transform = 'translateY(24px)';
  header.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  headerObserver.observe(header);
});

/* ===== LOGISTICS MAP: TN OUTLINE (SVG) ===== */
function buildTNMapBackground() {
  const mapEl = document.getElementById('logisticsMap');
  if (!mapEl) return;
  
  // Simplified TN state outline drawn as gradient background
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 200 420');
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0.12;pointer-events:none;';
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  // Approximate Tamil Nadu outline
  path.setAttribute('d', 'M 90,20 L 130,30 L 150,60 L 160,90 L 155,120 L 145,150 L 150,180 L 140,210 L 145,240 L 135,270 L 120,290 L 110,320 L 100,350 L 85,380 L 70,400 L 55,380 L 50,350 L 45,310 L 55,280 L 60,250 L 50,220 L 45,190 L 50,160 L 60,130 L 55,100 L 65,70 L 80,45 Z');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'rgba(34,197,94,1)');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linejoin', 'round');
  
  svg.appendChild(path);
  mapEl.appendChild(svg);
}
buildTNMapBackground();

/* ===== AGRO FEATURES HOVER HIGHLIGHT ===== */
document.querySelectorAll('.agro-feature').forEach(feature => {
  feature.addEventListener('mouseenter', () => {
    document.querySelectorAll('.agro-feature').forEach(f => {
      f.style.opacity = f === feature ? '1' : '0.6';
    });
  });
  feature.addEventListener('mouseleave', () => {
    document.querySelectorAll('.agro-feature').forEach(f => {
      f.style.opacity = '1';
    });
  });
});

/* ===== FINANCE TABLE ROW HOVER ===== */
document.querySelectorAll('.finance-table tr').forEach(row => {
  row.addEventListener('mouseenter', () => {
    row.style.background = 'rgba(34,197,94,0.06)';
    row.style.borderRadius = '4px';
  });
  row.addEventListener('mouseleave', () => {
    row.style.background = '';
  });
});

/* ===== PERFORMANCE: Debounce scroll ===== */
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

console.log('%c🌿 TN BioRefinery — Advanced Bio-LPG & Ethanol Initiative', 'color:#22c55e;font-size:14px;font-weight:bold;');
console.log('%cGovernment of Tamil Nadu — Energy Department', 'color:#94a3b8;font-size:11px;');
