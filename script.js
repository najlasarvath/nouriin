// ─── Element References ────────────────────────────────────
const revealButton = document.querySelector('#revealButton');
const letter = document.querySelector('#letter');
const buttonLabel = revealButton.querySelector('span');
const wishButton = document.querySelector('#wishButton');
const wishStatus = document.querySelector('#wishStatus');
const copyButton = document.querySelector('#copyButton');
const shareButton = document.querySelector('#shareButton');
const actionStatus = document.querySelector('#actionStatus');
const messageText = document.querySelector('.letter-content').innerText;
const noteMessage = document.querySelector('#noteMessage');
const secretStar = document.querySelector('#secretStar');
const secretNote = document.querySelector('#secretNote');
const sky = document.querySelector('.sky');

const noteMessages = {
  kindness: 'You make people feel seen, safe, and a little more hopeful just by being yourself.',
  magic: 'You turn ordinary moments into stories people remember long after they happen.',
  heart: 'Your heart is a rare place: warm, brave, and big enough to make distance feel small.'
};

// ═══════════════════════════════════════════════════════════
//  SCROLL-REVEAL  (Intersection Observer)
// ═══════════════════════════════════════════════════════════
function initScrollReveal() {
  const revealTargets = [
    { selector: '.distance-strip', cls: 'reveal' },
    { selector: '.wish-copy', cls: 'reveal-left' },
    { selector: '.wish-action', cls: 'reveal-right' },
    { selector: '.pharmacy-note', cls: 'reveal-scale' },
    { selector: '.love-notes-heading', cls: 'reveal-left' },
    { selector: '.note-selector', cls: 'reveal-right', delay: 'delay-2' },
    { selector: '.footer', cls: 'reveal' },
  ];

  revealTargets.forEach(({ selector, cls, delay }) => {
    const el = document.querySelector(selector);
    if (el && !el.classList.contains(cls)) {
      el.classList.add(cls);
      if (delay) el.classList.add(delay);
    }
  });

  // Stagger distance items
  document.querySelectorAll('.distance-item').forEach((item, i) => {
    item.classList.add('reveal');
    item.classList.add(`delay-${i + 1}`);
  });

  // Stagger dose rows
  document.querySelectorAll('.dose-row').forEach((row, i) => {
    row.classList.add('reveal');
    row.classList.add(`delay-${i + 1}`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => {
    // If element is already in the viewport, reveal immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('is-visible');
    } else {
      observer.observe(el);
    }
  });
}

// ═══════════════════════════════════════════════════════════
//  FLOATING PARTICLES
// ═══════════════════════════════════════════════════════════
function initParticles() {
  const colors = [
    'rgba(241, 201, 138, 0.4)',
    'rgba(230, 141, 114, 0.35)',
    'rgba(255, 255, 255, 0.2)',
    'rgba(241, 201, 138, 0.25)',
  ];

  function createParticle() {
    const particle = document.createElement('span');
    particle.className = 'particle';
    const size = Math.random() * 4 + 2;
    const duration = Math.random() * 12 + 10;
    const left = Math.random() * 100;
    const color = colors[Math.floor(Math.random() * colors.length)];

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      background: ${color};
      box-shadow: 0 0 ${size * 3}px ${color};
      animation-duration: ${duration}s;
      animation-delay: ${Math.random() * 4}s;
    `;

    sky.appendChild(particle);
    setTimeout(() => {
      particle.remove();
      createParticle();
    }, (duration + 4) * 1000);
  }

  const count = window.innerWidth < 720 ? 8 : 15;
  for (let i = 0; i < count; i++) {
    setTimeout(() => createParticle(), i * 600);
  }
}

// ═══════════════════════════════════════════════════════════
//  PARALLAX MOON ON SCROLL
// ═══════════════════════════════════════════════════════════
function initParallax() {
  const moon = document.querySelector('.moon');
  const moonGlow = document.querySelector('.moon-glow');
  const hero = document.querySelector('.hero');
  if (!moon || !hero) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const progress = -rect.top / (rect.height || 1);
        if (progress >= -0.3 && progress <= 1.3) {
          const yOffset = progress * 30;
          const scale = 1 + progress * 0.05;
          moon.style.transform = `translateY(${-yOffset}px) scale(${Math.max(0.95, Math.min(scale, 1.1))})`;
          if (moonGlow) {
            moonGlow.style.transform = `scale(${Math.max(0.9, Math.min(scale * 1.05, 1.2))})`;
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ═══════════════════════════════════════════════════════════
//  TOUCH / CLICK RIPPLE
// ═══════════════════════════════════════════════════════════
function initTouchRipple() {
  window.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button, a')) return;
    const star = document.createElement('span');
    star.className = 'star';
    star.style.left = `${event.clientX}px`;
    star.style.top = `${event.clientY}px`;
    star.style.position = 'fixed';
    star.style.animation = 'twinkle 1.4s ease-out forwards';
    sky.appendChild(star);
    setTimeout(() => star.remove(), 1500);
  });
}

// ═══════════════════════════════════════════════════════════
//  SPARKLE BURST  (used by wish + dose rows)
// ═══════════════════════════════════════════════════════════
function createSparkleBurst(targetEl, count = 20, palette) {
  const rect = targetEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const defaultPalette = ['#f1c98a', '#e68d72', '#fff9dd', '#ffe3a6'];
  const colors = palette || defaultPalette;

  for (let i = 0; i < count; i++) {
    const spark = document.createElement('span');
    spark.className = 'sparkle-particle';
    const angle = (i / count) * Math.PI * 2;
    const radius = 40 + Math.random() * 100;
    const size = 3 + Math.random() * 5;
    const color = colors[Math.floor(Math.random() * colors.length)];

    spark.style.cssText = `
      position: fixed;
      left: ${cx}px;
      top: ${cy}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color};
      box-shadow: 0 0 ${size * 2}px ${color};
      pointer-events: none;
      z-index: 9999;
      --tx: ${Math.cos(angle) * radius}px;
      --ty: ${Math.sin(angle) * radius}px;
      animation: sparkleBurst 0.8s ${i * 0.02}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    `;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 1200);
  }
}

// ═══════════════════════════════════════════════════════════
//  CONFETTI  (for the letter reveal)
// ═══════════════════════════════════════════════════════════
function createConfetti(count = 30) {
  const colors = ['#f1c98a', '#e68d72', '#fff9dd', '#ffe3a6', '#a8b0bc'];
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('span');
    confetti.className = 'confetti-piece';
    const x = Math.random() * window.innerWidth;
    const size = 4 + Math.random() * 6;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const isCircle = Math.random() > 0.5;

    confetti.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: -10px;
      width: ${isCircle ? size : size * 0.5}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${isCircle ? '50%' : '2px'};
      pointer-events: none;
      z-index: 9999;
      opacity: 0.9;
      animation: confettiFall ${2 + Math.random() * 2}s ${i * 0.05}s ease-out forwards;
      --drift: ${(Math.random() - 0.5) * 200}px;
      --spin: ${Math.random() * 720}deg;
    `;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4500);
  }
}

// ═══════════════════════════════════════════════════════════
//  BUTTON: "Open your little surprise" (Reveal Letter)
// ═══════════════════════════════════════════════════════════
revealButton.addEventListener('click', () => {
  const isOpen = letter.classList.toggle('is-open');
  buttonLabel.textContent = isOpen ? 'Close your little surprise' : 'Open your little surprise';
  revealButton.setAttribute('aria-expanded', String(isOpen));

  if (isOpen) {
    // Confetti rain 🎊
    createConfetti(35);
    // Sparkle burst from the button itself
    createSparkleBurst(revealButton, 14);
    setTimeout(() => letter.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
  }
});

// ═══════════════════════════════════════════════════════════
//  BUTTON: "Send a wish" ✨
// ═══════════════════════════════════════════════════════════
let wishSent = false;
wishButton.addEventListener('click', () => {
  if (wishSent) return; // Prevent double-click
  wishSent = true;

  // Big sparkle burst centered on the button
  createSparkleBurst(wishButton, 28, ['#f1c98a', '#ffe3a6', '#fff9dd', '#e68d72']);

  // Update button state with animation
  wishButton.classList.add('is-sent');
  wishButton.querySelector('.wish-button-icon').innerHTML = '&#10003;';
  wishButton.querySelector('span:last-child').textContent = '  Wish sent!';
  wishStatus.classList.add('is-sent');
  wishStatus.textContent = '✨ the sky is keeping it safe for her ✨';

  // Create a wave of rising stars
  for (let i = 0; i < 15; i++) {
    const star = document.createElement('span');
    star.className = 'rising-star';
    const btnRect = wishButton.getBoundingClientRect();
    const startX = btnRect.left + Math.random() * btnRect.width;
    const startY = btnRect.top;

    star.style.cssText = `
      position: fixed;
      left: ${startX}px;
      top: ${startY}px;
      width: ${3 + Math.random() * 4}px;
      height: ${3 + Math.random() * 4}px;
      border-radius: 50%;
      background: ${Math.random() > 0.5 ? '#f1c98a' : '#e68d72'};
      box-shadow: 0 0 10px ${Math.random() > 0.5 ? '#f1c98a' : '#e68d72'};
      pointer-events: none;
      z-index: 9999;
      animation: riseAndFade 1.5s ${i * 0.08}s ease-out forwards;
    `;
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 2500);
  }
});

// ═══════════════════════════════════════════════════════════
//  BUTTON: Copy Message
// ═══════════════════════════════════════════════════════════
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(messageText);
    actionStatus.textContent = '✓ Message copied for Nourin';
    actionStatus.classList.add('success-flash');
    createSparkleBurst(copyButton, 8);
    setTimeout(() => actionStatus.classList.remove('success-flash'), 2000);
  } catch {
    // Fallback: create a textarea and copy
    const ta = document.createElement('textarea');
    ta.value = messageText;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      actionStatus.textContent = '✓ Message copied for Nourin';
    } catch {
      actionStatus.textContent = 'Long-press the text above to copy';
    }
    ta.remove();
  }
});

// ═══════════════════════════════════════════════════════════
//  BUTTON: Share Page
// ═══════════════════════════════════════════════════════════
shareButton.addEventListener('click', async () => {
  const shareData = {
    title: 'For Nourin, across every mile',
    text: 'A birthday wish for Nourin, from Najla.',
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      actionStatus.textContent = '✓ Ready to send to Nourin';
      createSparkleBurst(shareButton, 8);
    } catch {
      // User cancelled share — that's OK
    }
    return;
  }

  // Fallback: copy URL
  try {
    await navigator.clipboard.writeText(window.location.href);
    actionStatus.textContent = '✓ Page link copied to share';
    createSparkleBurst(shareButton, 8);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = window.location.href;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      actionStatus.textContent = '✓ Page link copied';
    } catch {
      actionStatus.textContent = 'Copy the URL from your address bar';
    }
    ta.remove();
  }
});

// ═══════════════════════════════════════════════════════════
//  TABS: "Three little truths about you"
// ═══════════════════════════════════════════════════════════
document.querySelectorAll('.note-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.note-tab').forEach((otherTab) => {
      otherTab.classList.remove('is-active');
      otherTab.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    noteMessage.textContent = noteMessages[tab.dataset.note];
    noteMessage.style.animation = 'none';
    noteMessage.offsetHeight; // Force reflow
    noteMessage.style.animation = 'note-in .45s ease both';

    // Small sparkle on tab click
    createSparkleBurst(tab, 6, ['#f1c98a', '#ffe3a6']);
  });
});

// ═══════════════════════════════════════════════════════════
//  PHARMACY NOTE — Interactive Dose Rows
// ═══════════════════════════════════════════════════════════
const doseMessages = [
  { emoji: '💪', text: 'Courage dispensed — take with chai!' },
  { emoji: '💛', text: 'Kindness refilled — share freely!' },
  { emoji: '✨', text: 'Unlimited dreams activated!' },
];

document.querySelectorAll('.dose-row').forEach((row, index) => {
  row.style.cursor = 'pointer';
  row.setAttribute('role', 'button');
  row.setAttribute('tabindex', '0');

  function dispenseDose() {
    if (row.classList.contains('is-dispensed')) return;
    row.classList.add('is-dispensed');

    // Sparkle burst from the row
    createSparkleBurst(row, 10, ['#f1c98a', '#e68d72', '#ffe3a6']);

    // Show dispensed tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'dose-tooltip';
    tooltip.textContent = `${doseMessages[index].emoji} ${doseMessages[index].text}`;
    row.style.position = 'relative';
    row.appendChild(tooltip);

    // Animate tooltip in
    requestAnimationFrame(() => {
      tooltip.classList.add('is-shown');
    });

    // Remove tooltip after 3 seconds
    setTimeout(() => {
      tooltip.classList.remove('is-shown');
      setTimeout(() => tooltip.remove(), 500);
    }, 3000);
  }

  row.addEventListener('click', dispenseDose);
  row.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      dispenseDose();
    }
  });
});

// Make the Rx mark spin faster on click
const rxMark = document.querySelector('.rx-mark');
if (rxMark) {
  rxMark.style.cursor = 'pointer';
  rxMark.addEventListener('click', () => {
    rxMark.classList.add('rx-spin');
    createSparkleBurst(rxMark, 16, ['#f1c98a', '#e68d72']);
    setTimeout(() => rxMark.classList.remove('rx-spin'), 1200);
  });
}

// ═══════════════════════════════════════════════════════════
//  FOOTER SECRET STAR ✦
// ═══════════════════════════════════════════════════════════
secretStar.addEventListener('click', () => {
  const isVisible = secretNote.classList.toggle('is-visible');
  secretStar.setAttribute('aria-expanded', String(isVisible));
  if (isVisible) {
    createSparkleBurst(secretStar, 12, ['#f1c98a', '#ffe3a6']);
  }
});

// ═══════════════════════════════════════════════════════════
//  INITIALIZE
// ═══════════════════════════════════════════════════════════
function init() {
  initScrollReveal();
  initParticles();
  initParallax();
  initTouchRipple();
}

// Run once — script is at bottom of body so DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
