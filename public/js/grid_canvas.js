
const canvas = document.getElementById('gridCanvas');
  if (canvas) {
const ctx = canvas.getContext('2d');
const footer = document.getElementById('data-cta');

// --- Config ---
const DOT_SPACING = 42;
const DOT_RADIUS = 3;
const DOT_COLOR = 'rgba(255, 255, 255, 0.18)';
const DOT_HOVER_COLOR = 'rgba(255, 255, 255, 0.55)';
const LINE_COLOR_START = 'rgba(255, 255, 255, 0.95)';
const LINE_COLOR_END = 'rgba(255, 255, 255, 0)';
const MAX_TRAIL_LENGTH = 14;
const SNAP_RADIUS = 80;
const MIN_DISTANCE_BETWEEN_POINTS = 24;
const LINE_WIDTH = 2.5;

let dpr = window.devicePixelRatio || 1;
let dots = [];
let trail = []; // Array of {x, y} snapped dot positions
let mousePos = { x: -1000, y: -1000 };
let isInFooter = false;
let animId;
let lastMoveTime = Date.now();
const IDLE_TIMEOUT = 0; // start fading immediately
const TOTAL_FADE_TIME = 800; // fully gone in 800ms

function resize() {
  const rect = footer.getBoundingClientRect();
  dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  buildDots(rect.width, rect.height);
}

function buildDots(w, h) {
  dots = [];
  const offsetX = (w % DOT_SPACING) / 2;
  const offsetY = (h % DOT_SPACING) / 2;
  for (let x = offsetX; x <= w; x += DOT_SPACING) {
    for (let y = offsetY; y <= h; y += DOT_SPACING) {
      dots.push({ x, y });
    }
  }
}

function getClosestDot(px, py) {
  let closest = null;
  let minDist = Infinity;
  for (const dot of dots) {
    const d = Math.hypot(dot.x - px, dot.y - py);
    if (d < minDist && d < SNAP_RADIUS) {
      minDist = d;
      closest = dot;
    }
  }
  return closest;
}

function addToTrail(dot) {
  if (!dot) return;
  const last = trail[trail.length - 1];
  if (last && last.x === dot.x && last.y === dot.y) return;
  if (last && Math.hypot(last.x - dot.x, last.y - dot.y) < MIN_DISTANCE_BETWEEN_POINTS) return;

  trail.push({ x: dot.x, y: dot.y });

  if (trail.length > MAX_TRAIL_LENGTH) {
    trail.shift();
  }
}

function draw() {
  const rect = footer.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;

  ctx.clearRect(0, 0, w, h);

  const timeSinceMove = Date.now() - lastMoveTime;
  let trailOpacity = 1;
  if (timeSinceMove > IDLE_TIMEOUT) {
    const fadeElapsed = timeSinceMove - IDLE_TIMEOUT;
    const fadeDuration = TOTAL_FADE_TIME - IDLE_TIMEOUT;
    trailOpacity = Math.max(0, 1 - fadeElapsed / fadeDuration);
  }

  if (trailOpacity <= 0 && trail.length > 0) {
    trail = [];
  }

  // Draw dots
  for (const dot of dots) {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = DOT_COLOR;
    ctx.fill();
  }

  // Draw trail line
  if (trail.length >= 2 && trailOpacity > 0) {
    for (let i = 1; i < trail.length; i++) {
      const t = i / (trail.length - 1);
      const alpha = Math.pow(t, 1.5) * 0.9 * trailOpacity;
      const width = LINE_WIDTH * (0.3 + t * 0.7);

      ctx.beginPath();
      ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
      ctx.lineTo(trail[i].x, trail[i].y);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    // Draw dots on trail nodes
    for (let i = 0; i < trail.length; i++) {
      const t = i / (trail.length - 1);
      const alpha = Math.pow(t, 1.5) * 0.85 * trailOpacity;
      const r = 3 + t * 2.5;

      ctx.beginPath();
      ctx.arc(trail[i].x, trail[i].y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }
  }

  animId = requestAnimationFrame(draw);
}

// --- Events ---
footer.addEventListener('mousemove', (e) => {
  const rect = footer.getBoundingClientRect();
  mousePos.x = e.clientX - rect.left;
  mousePos.y = e.clientY - rect.top;
  lastMoveTime = Date.now();

  const closest = getClosestDot(mousePos.x, mousePos.y);
  addToTrail(closest);
});

footer.addEventListener('mouseenter', () => {
  isInFooter = true;
});

footer.addEventListener('mouseleave', () => {
  isInFooter = false;
  mousePos.x = -1000;
  mousePos.y = -1000;
});

window.addEventListener('resize', resize);

resize();
draw();
  }
  
gsap.timeline({
    scrollTrigger: {
      trigger: '.footer_logo',
      start: 'center bottom',
      toggleActions: 'play none none reverse'
    }
  })
  .from('.footer_logo path', {
    yPercent: -120,
    opacity: 0,
    duration: 1.5,
    stagger: 0.2,
    ease: 'power4.out'
  })

const footerLinks = gsap.utils.toArray('.footer_link')

footerLinks.forEach(link => {
  const circ = link.querySelector('.footer_circ')
  const text = link.querySelector('.footer_text')

  gsap.set(circ, { scale: 0, transformOrigin: 'center center' })

  let tl = gsap.timeline({ paused: true })
    .to(circ, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    }, 0)
    .to(text, {
      x: '1rem',
      duration: 0.3,
      ease: 'power2.out'
    }, 0)

  link.addEventListener('mouseenter', () => {
    tl.kill()
    tl = gsap.timeline()
      .to(circ, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      }, 0)
      .to(text, {
        x: '1rem',
        duration: 0.3,
        ease: 'power2.out'
      }, 0)
  })

  link.addEventListener('mouseleave', () => {
    tl.kill()
    tl = gsap.timeline()
      .to(circ, {
        scale: 0,
        duration: 0.3,
        ease: 'power2.out'
      }, 0)
      .to(text, {
        x: 0,
        duration: 0.3,
        ease: 'power2.out'
      }, 0)
  })
})
