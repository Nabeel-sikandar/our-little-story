// ===== WELCOME SCREEN =====
document.body.classList.add('no-scroll'); // scroll lock jab tak welcome screen khula hai

const welcomeScreen = document.getElementById('welcome-screen');
const welcomeOpenBtn = document.getElementById('welcome-open-btn');

welcomeOpenBtn.addEventListener('click', () => {
  welcomeScreen.classList.add('hidden');
  document.body.classList.remove('no-scroll');
  window.scrollTo(0, 0); // ensure top se shuru ho
});
// ===== CONFIG =====
const TOTAL_FRAMES = 70; // apni total frame count yahan daalo
const FRAME_PATH = (i) => `frames/frame_ (${i}).jpg`;
// ^ ye "frame_ (1).jpg" se "frame_ (68).jpg" tak expect karta hai

const canvas = document.getElementById('frame-canvas');
const ctx = canvas.getContext('2d');
const introSection = document.getElementById('intro-section');
const scrollHint = document.getElementById('scroll-hint');
const loader = document.getElementById('loader');

const images = [];
let loadedCount = 0;

// ===== PRELOAD ALL FRAMES =====
for (let i = 1; i <= TOTAL_FRAMES; i++) {
  const img = new Image();
  img.src = FRAME_PATH(i);
  img.onload = () => {
    loadedCount++;
    if (loadedCount === TOTAL_FRAMES) {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 600);
      drawFrame(0);
    }
  };
  images.push(img);
}

// ===== CANVAS SIZE SET KARO =====
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ===== FRAME DRAW KARNE KA FUNCTION =====
function drawFrame(index) {
  const img = images[index];
  if (!img || !img.complete) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const canvasRatio = canvas.width / canvas.height;
  const imgRatio = img.width / img.height;
  let drawWidth, drawHeight, offsetX, offsetY;

  if (imgRatio > canvasRatio) {
    drawHeight = canvas.height;
    drawWidth = img.width * (drawHeight / img.height);
    offsetX = (canvas.width - drawWidth) / 2;
    offsetY = 0;
  } else {
    drawWidth = canvas.width;
    drawHeight = img.height * (drawWidth / img.width);
    offsetX = 0;
    offsetY = (canvas.height - drawHeight) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

// ===== SCROLL PE FRAME CHANGE KARO =====
function updateFrameOnScroll() {
  const rect = introSection.getBoundingClientRect();
  const sectionHeight = introSection.offsetHeight - window.innerHeight;
  let scrollProgress = -rect.top / sectionHeight;
  scrollProgress = Math.max(0, Math.min(1, scrollProgress));

  const frameIndex = Math.min(
    TOTAL_FRAMES - 1,
    Math.floor(scrollProgress * TOTAL_FRAMES)
  );

  drawFrame(frameIndex);

  if (scrollProgress > 0.03) {
    scrollHint.classList.add('hidden');
  } else {
    scrollHint.classList.remove('hidden');
  }
}

window.addEventListener('scroll', updateFrameOnScroll);

// ===== PHOTO GALLERY: 20 PHOTOS AUTOMATICALLY GENERATE KARO =====
const GALLERY_COUNT = 20;
const galleryGrid = document.getElementById('gallery-grid');
const rotations = [-6, 4, -3, 5, -5, 3, -4, 6, -2, 4, -6, 3, -4, 5, -3, 6, -5, 2, -6, 4];

for (let i = 1; i <= GALLERY_COUNT; i++) {
  const rotate = rotations[(i - 1) % rotations.length];
  const div = document.createElement('div');
  div.className = 'polaroid';
  div.style.setProperty('--rotate', `${rotate}deg`);
  div.style.setProperty('--delay', `${(i % 6) * 0.15}s`);

  const heights = [180, 220, 260, 200, 240, 190];
  div.style.setProperty('--ph-height', `${heights[i % heights.length]}px`);

  const img = document.createElement('img');
  img.src = `images/gallery${i}.jpeg`;
  img.alt = `Memory ${i}`;

  img.onerror = function () {
    div.classList.add('img-missing');
  };
  img.addEventListener('click', () => openLightbox(i - 1));

  div.appendChild(img);
  galleryGrid.appendChild(div);
}

// ===== FLOATING DECORATIONS IN GALLERY SECTION =====
const gallerySection = document.getElementById('gallery-section');
const decos = ['💕', '✨', '🌸', '💫'];
for (let i = 0; i < 15; i++) {
  const deco = document.createElement('div');
  deco.className = 'floating-deco';
  deco.textContent = decos[Math.floor(Math.random() * decos.length)];
  deco.style.left = `${Math.random() * 100}%`;
  deco.style.bottom = `-30px`;
  deco.style.animationDuration = `${8 + Math.random() * 8}s`;
  deco.style.animationDelay = `${Math.random() * 8}s`;
  gallerySection.appendChild(deco);
}

// ===== LIGHTBOX FUNCTIONALITY =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
let currentPhotoIndex = 0;

function openLightbox(index) {
  currentPhotoIndex = index;
  lightboxImg.src = `images/gallery${index + 1}.jpeg`;
  lightbox.classList.add('active');
}

function closeLightbox() {
  lightbox.classList.remove('active');
}

function showPrev() {
  currentPhotoIndex = (currentPhotoIndex - 1 + GALLERY_COUNT) % GALLERY_COUNT;
  lightboxImg.src = `images/gallery${currentPhotoIndex + 1}.jpeg`;
}

function showNext() {
  currentPhotoIndex = (currentPhotoIndex + 1) % GALLERY_COUNT;
  lightboxImg.src = `images/gallery${currentPhotoIndex + 1}.jpeg`;
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

// ===== WISHES SECTION: FIREFLIES + PETALS + SCROLL-REVEAL =====
const wishesSection = document.getElementById('wishes-section');
const petalEmojis = ['🌸', '🌺', '💮'];

for (let i = 0; i < 18; i++) {
  const petal = document.createElement('div');
  petal.className = 'drift-item petal-drift';
  petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.setProperty('--drift', `${(Math.random() - 0.5) * 180}px`);
  petal.style.animationDuration = `${8 + Math.random() * 10}s`;
  petal.style.animationDelay = `${Math.random() * 12}s`;
  petal.style.fontSize = `${14 + Math.random() * 10}px`;
  petal.style.opacity = '0.6';
  wishesSection.appendChild(petal);
}

for (let i = 0; i < 35; i++) {
  const fly = document.createElement('div');
  fly.className = 'drift-item firefly';
  fly.style.left = `${Math.random() * 100}%`;
  fly.style.top = `${Math.random() * 100}%`;
  fly.style.setProperty('--dx', `${(Math.random() - 0.5) * 60}px`);
  fly.style.setProperty('--dy', `${(Math.random() - 0.5) * 60}px`);
  fly.style.animationDuration = `${3 + Math.random() * 4}s`;
  fly.style.animationDelay = `${Math.random() * 4}s`;
  wishesSection.appendChild(fly);
}

const wishesReveal = document.getElementById('wishes-reveal');
const wishesObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      wishesReveal.classList.add('in-view');
      wishesObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

wishesObserver.observe(wishesReveal);

// ===== STACKING NOTES CARDS =====

// Yahan apne saare notes likho — jitne chaho daal sakte ho
const noteMessages = [
  "Here's a little secret I never told you...",
  "Remember that day we laughed until we cried?",
  "You've always been my safe place.",
  "I'm so proud of the person you've become.",
  "Thank you for every memory we made together.",
  "No matter where life takes us, you'll always be my best friend.",
  "I still remember the first day we met.",
  "May your new home be filled with as much love as you've given me."
];

const notesCardsContainer = document.getElementById('notes-cards-container');
const notesScrollTrack = document.getElementById('notes-scroll-track');
const noteIcons = ['💌', '🕊️', '✨', '🌸', '💫', '🤍', '🌙', '💞'];

const noteCardEls = noteMessages.map((text, i) => {
  const card = document.createElement('div');
  card.className = 'note-card-stack';

  const icon = document.createElement('div');
  icon.className = 'note-card-icon';
  icon.textContent = noteIcons[i % noteIcons.length];

  const p = document.createElement('p');
  p.textContent = text;

  card.appendChild(icon);
  card.appendChild(p);
  notesCardsContainer.appendChild(card);
  return card;
});

notesScrollTrack.style.height = `${noteMessages.length * 130}vh`;

function updateNoteCards() {
  const rect = notesScrollTrack.getBoundingClientRect();
  const trackHeight = notesScrollTrack.offsetHeight - window.innerHeight;
  let overallProgress = -rect.top / trackHeight;
  overallProgress = Math.max(0, Math.min(1, overallProgress));

  const n = noteCardEls.length;

  noteCardEls.forEach((card, index) => {
    const start = index / (n + 1);
    const end = (index + 1) / (n + 1);
    const rotateEnd = (start + (end - start) / 1.5);

    let local = (overallProgress - start) / (rotateEnd - start);
    local = Math.max(0, Math.min(1, local));

    const initialRotation = (index % 2 === 0 ? 1 : -1) * (6 + index * 1.5);
    const rotate = initialRotation * (1 - local);
    const translateY = local * -160;

    const incrementZ = 10;
    const z = index * incrementZ;
    const topOffset = index * 8;

    card.style.transform = `translateZ(${z}px) translateY(${translateY}%) rotate(${rotate}deg)`;
    card.style.top = `${topOffset}px`;
    card.style.zIndex = n - index;

    const fadeLocal = Math.max(0, Math.min(1, (overallProgress - end) / 0.15));
    card.style.opacity = index === 0 ? 1 : (1 - (index > 0 && overallProgress > end ? fadeLocal : 0));
  });
}

window.addEventListener('scroll', updateNoteCards);
window.addEventListener('resize', updateNoteCards);
updateNoteCards();

// ===== FINAL PAGE: CONSTELLATION + SCROLL-REVEAL =====
const finalSection = document.getElementById('final-section');
const finalReveal = document.getElementById('final-reveal');
const constellationCanvas = document.getElementById('constellation-canvas');
const cCtx = constellationCanvas.getContext('2d');

let stars = [];
let constellationActive = false;

function resizeConstellation() {
  constellationCanvas.width = finalSection.offsetWidth;
  constellationCanvas.height = finalSection.offsetHeight;
}
resizeConstellation();
window.addEventListener('resize', resizeConstellation);

function createStars() {
  const count = 70;
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * constellationCanvas.width,
      y: Math.random() * constellationCanvas.height,
      radius: 0.8 + Math.random() * 1.8,
      twinkleSpeed: 0.5 + Math.random() * 1.5,
      twinkleOffset: Math.random() * Math.PI * 2,
      brightness: 0.4 + Math.random() * 0.6
    });
  }
}
createStars();

// Connect nearby stars with faint lines (constellation effect)
function getConnections() {
  const connections = [];
  const maxDist = 140;
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        connections.push([i, j, 1 - dist / maxDist]);
      }
    }
  }
  return connections;
}
const starConnections = getConnections();

let animTime = 0;
function animateConstellation() {
  if (!constellationActive) return;
  animTime += 0.016;

  cCtx.clearRect(0, 0, constellationCanvas.width, constellationCanvas.height);

  // Draw connection lines
  cCtx.strokeStyle = 'rgba(245, 227, 168, 0.08)';
  cCtx.lineWidth = 1;
  starConnections.forEach(([i, j, strength]) => {
    cCtx.globalAlpha = strength * 0.5;
    cCtx.beginPath();
    cCtx.moveTo(stars[i].x, stars[i].y);
    cCtx.lineTo(stars[j].x, stars[j].y);
    cCtx.stroke();
  });
  cCtx.globalAlpha = 1;

  // Draw twinkling stars
  stars.forEach(star => {
    const twinkle = 0.6 + 0.4 * Math.sin(animTime * star.twinkleSpeed + star.twinkleOffset);
    const alpha = star.brightness * twinkle;
    cCtx.beginPath();
    cCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    cCtx.fillStyle = `rgba(255, 246, 217, ${alpha})`;
    cCtx.shadowColor = 'rgba(245, 227, 168, 0.8)';
    cCtx.shadowBlur = 6;
    cCtx.fill();
  });

  requestAnimationFrame(animateConstellation);
}

const finalObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      finalReveal.classList.add('in-view');
      if (!constellationActive) {
        constellationActive = true;
        resizeConstellation();
        createStars();
        animateConstellation();
      }
      finalObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

finalObserver.observe(finalReveal);
// ===== CURSOR SPARKLE TRAIL =====
const sparkleColors = ['#f5e3a8', '#e8b8d4', '#c9a8e8', '#fff6d9'];
let lastSparkleTime = 0;

function createCursorSparkle(x, y) {
  const now = Date.now();
  if (now - lastSparkleTime < 60) return; // throttle — har 60ms mein ek sparkle (performance ke liye)
  lastSparkleTime = now;

  const sparkle = document.createElement('div');
  sparkle.className = 'cursor-sparkle';

  const size = 3 + Math.random() * 4;
  const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];

  sparkle.style.width = `${size}px`;
  sparkle.style.height = `${size}px`;
  sparkle.style.left = `${x - size / 2}px`;
  sparkle.style.top = `${y - size / 2}px`;
  sparkle.style.background = color;
  sparkle.style.boxShadow = `0 0 ${size * 2}px ${size / 2}px ${color}`;

  document.body.appendChild(sparkle);

  setTimeout(() => sparkle.remove(), 900);
}

// Desktop: mouse move
document.addEventListener('mousemove', (e) => {
  createCursorSparkle(e.clientX, e.clientY);
});

// Mobile: finger drag
document.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  if (touch) createCursorSparkle(touch.clientX, touch.clientY);
}, { passive: true });
// ===== FLOATING NAVIGATION DOTS =====
const navDots = document.querySelectorAll('.nav-dot');
const navSections = [
  document.getElementById('intro-section'),
  document.getElementById('gallery-section'),
  document.getElementById('wishes-section'),
  document.getElementById('notes-section'),
  document.getElementById('final-section')
];

function updateActiveDot() {
  const scrollMid = window.scrollY + window.innerHeight / 2;

  let activeIndex = 0;
  navSections.forEach((section, i) => {
    if (section.offsetTop <= scrollMid) {
      activeIndex = i;
    }
  });

  navDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === activeIndex);
  });
}

// Smooth scroll jab dot pe click ho
navDots.forEach((dot) => {
  dot.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = dot.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    targetSection.scrollIntoView({ behavior: 'smooth' });
  });
});

window.addEventListener('scroll', updateActiveDot);
updateActiveDot(); // initial call
// ===== BACKGROUND MUSIC TOGGLE =====
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
let musicPlaying = false;

musicToggle.addEventListener('click', () => {
  if (musicPlaying) {
    bgMusic.pause();
    musicToggle.textContent = '🔇';
    musicToggle.classList.remove('playing');
  } else {
    bgMusic.play().catch(() => {
      // agar browser block kare to silently fail ho jaye
    });
    musicToggle.textContent = '🎵';
    musicToggle.classList.add('playing');
  }
  musicPlaying = !musicPlaying;
});

// Welcome screen ka "Open" button dabane pe music auto-start karne ki koshish
// (kyunki ye user ka pehla interaction hai, browsers isse allow kar dete hain)
welcomeOpenBtn.addEventListener('click', () => {
  bgMusic.play().then(() => {
    musicPlaying = true;
    musicToggle.textContent = '🎵';
    musicToggle.classList.add('playing');
  }).catch(() => {
    // agar autoplay block ho jaye, button manual rahega
  });
});