/* ============================================
   CHRONOLUX — script.js
   Cinematic Intro, 3D Carousel, Scroll-driven
   frame animation, GSAP effects, custom cursor,
   localStorage watch data
   ============================================ */

const qs = (s) => document.querySelector(s);
const qsa = (s) => document.querySelectorAll(s);

// ── Default Watch Data ──
const DEFAULT_WATCHES = [
  {
    id: "w1",
    name: "Chronolux Sovereign",
    description: "18K rose gold chronograph with moonphase complication",
    price: "$18,750",
    image: "ezgif-frame-100.jpg",
    category: "trending",
  },
  {
    id: "w2",
    name: "Chronolux Voyager",
    description: "Titanium sports chronograph with ceramic bezel",
    price: "$8,900",
    image: "ezgif-frame-110.jpg",
    category: "trending",
  },
  {
    id: "w3",
    name: "Chronolux Celestial",
    description: "Skeleton tourbillon with sapphire case back",
    price: "$22,000",
    image: "ezgif-frame-120.jpg",
    category: "trending",
  },
  {
    id: "w4",
    name: "Chronolux Meridian",
    description: "White gold dress watch with enamel dial",
    price: "$15,200",
    image: "ezgif-frame-130.jpg",
    category: "trending",
  },
  {
    id: "w5",
    name: "Chronolux Heritage",
    description: "Hand-wound movement, 40mm rose gold case",
    price: "$12,500",
    image: "ezgif-frame-090.jpg",
    category: "collection",
  },
  {
    id: "w6",
    name: "Chronolux Eclipse",
    description: "Automatic chronograph with perpetual calendar",
    price: "$14,800",
    image: "ezgif-frame-140.jpg",
    category: "collection",
  },
  {
    id: "w7",
    name: "Chronolux Artisan",
    description: "Hand-finished movement with Geneva stripes",
    price: "$9,500",
    image: "ezgif-frame-150.jpg",
    category: "collection",
  },
  {
    id: "w8",
    name: "Chronolux Luminary",
    description: "Diamond-set bezel with mother of pearl dial",
    price: "$11,200",
    image: "ezgif-frame-160.jpg",
    category: "collection",
  },
  {
    id: "w9",
    name: "Chronolux Apex",
    description: "Carbon fiber case with racing-inspired chronograph",
    price: "$7,800",
    image: "ezgif-frame-170.jpg",
    category: "collection",
  },
  {
    id: "w10",
    name: "Chronolux Nocturne",
    description: "Black DLC-coated titanium, luminous hands",
    price: "$10,400",
    image: "ezgif-frame-180.jpg",
    category: "collection",
  },
];

function getWatches() {
  let w = localStorage.getItem("chronolux_watches");
  if (!w) {
    localStorage.setItem("chronolux_watches", JSON.stringify(DEFAULT_WATCHES));
    w = JSON.stringify(DEFAULT_WATCHES);
  }
  let parsed = JSON.parse(w);
  let modified = false;
  parsed = parsed.map(watch => {
    if (watch.image && !watch.image.startsWith('http') && !watch.image.startsWith('assets/')) {
      watch.image = 'assets/' + watch.image;
      modified = true;
    }
    return watch;
  });
  if (modified) {
    localStorage.setItem("chronolux_watches", JSON.stringify(parsed));
  }
  return parsed;
}

// ══════════════════════════════════════════
// CINEMATIC INTRO
// ══════════════════════════════════════════
function initCinematicIntro() {
  const intro = qs("#cinematic-intro");
  if (!intro) {
    initAll();
    return;
  }

  const stages = [
    qs("#intro-stage-1"),
    qs("#intro-stage-2"),
    qs("#intro-stage-3"),
  ];
  const progressBar = qs("#introProgressBar");
  const skipBtn = qs("#introSkip");
  const totalDuration = 7500;
  let currentStage = -1;
  let startTime = Date.now();
  let cancelled = false;

  // Particle system for intro
  initIntroParticles();

  function showStage(idx) {
    if (cancelled) return;
    stages.forEach((s, i) => {
      if (i === idx) s.classList.add("active");
      else s.classList.remove("active");
    });
    currentStage = idx;
    // Stagger tagline letters in stage 2
    if (idx === 1) {
      const spans = stages[1].querySelectorAll(".intro-tagline span");
      spans.forEach((sp, i) => {
        sp.style.transitionDelay = i * 0.04 + "s";
      });
    }
  }

  // Progress animation
  let progInterval = setInterval(() => {
    if (cancelled) {
      clearInterval(progInterval);
      return;
    }
    const elapsed = Date.now() - startTime;
    const pct = Math.min((elapsed / totalDuration) * 100, 100);
    if (progressBar) progressBar.style.width = pct + "%";
    if (elapsed >= totalDuration) {
      clearInterval(progInterval);
      endIntro();
    }
  }, 30);

  // Stage timing
  setTimeout(() => showStage(0), 300);
  setTimeout(() => showStage(1), 2800);
  setTimeout(() => showStage(2), 5200);

  function endIntro() {
    if (cancelled) return;
    cancelled = true;
    intro.classList.add("hidden");
    document.body.style.overflow = "";
    setTimeout(() => {
      intro.remove();
    }, 1500);
    initAll();
  }

  skipBtn.addEventListener("click", () => {
    clearInterval(progInterval);
    endIntro();
  });

  // Block scroll during intro
  document.body.style.overflow = "hidden";
}

// ── Intro Particle System ──
function initIntroParticles() {
  const canvas = qs("#particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w,
    h,
    particles = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.3 - 0.15;
      this.opacity = Math.random() * 0.6 + 0.1;
      this.hue = 38 + Math.random() * 15;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue},60%,65%,${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function animate() {
    if (!document.querySelector("#particle-canvas")) return;
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ══════════════════════════════════════════
// MAIN INITIALIZATION
// ══════════════════════════════════════════
window.addEventListener("load", () => {
  // Remove old loader quickly
  const loader = qs("#loader");
  if (loader) loader.classList.add("hidden");
  // Start cinematic intro
  initCinematicIntro();
});

function initAll() {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  initCursor();
  initScrollProgress();
  initNavbar();
  initHeroFrames();
  initHeroTextAnimations();
  renderTrending();
  renderCollection();
  initScrollAnimations();
  initStoryReveal();
  initTiltCards();
  initTrendingDrag();
  initContactForm();
  init3DCarousel();
  initCarouselParticles();
}

// ── Custom Cursor ──
function initCursor() {
  const dot = qs("#cursorDot"),
    ring = qs("#cursorRing");
  if (!dot || !ring) return;
  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top = my + "px";
  });
  (function loop() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(loop);
  })();
  qsa(
    "a, button, .trending-card, .collection-item, .carousel-card, input, textarea",
  ).forEach((el) => {
    el.addEventListener("mouseenter", () => {
      dot.classList.add("hover");
      ring.classList.add("hover");
    });
    el.addEventListener("mouseleave", () => {
      dot.classList.remove("hover");
      ring.classList.remove("hover");
    });
  });
}

// ── Scroll Progress ──
function initScrollProgress() {
  const bar = qs("#scroll-progress");
  window.addEventListener(
    "scroll",
    () => {
      const pct =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;
      bar.style.width = pct + "%";
    },
    { passive: true },
  );
}

// ── Navbar ──
function initNavbar() {
  const nav = qs("#navbar"),
    toggle = qs("#navToggle"),
    links = qs("#navLinks");
  let lastY = 0;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      nav.classList.toggle("scrolled", y > 80);
      if (y > 600) nav.classList.toggle("nav-hidden", y > lastY);
      else nav.classList.remove("nav-hidden");
      lastY = y;
    },
    { passive: true },
  );

  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
  });
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", (e) => {
      links.classList.remove("open");
      const href = a.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        const t = qs(href);
        if (t)
          gsap.to(window, {
            duration: 1.2,
            scrollTo: { y: t, offsetY: 80 },
            ease: "power3.inOut",
          });
      }
    });
  });

  const sections = qsa("section[id]");
  window.addEventListener(
    "scroll",
    () => {
      let current = "";
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 200) current = s.id;
      });
      links.querySelectorAll("a").forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === "#" + current);
      });
    },
    { passive: true },
  );
}

// ── Hero Frame Sequence (Full-Screen) ──
function initHeroFrames() {
  const canvas = qs("#frame-bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const frameCount = 192;
  const images = [];
  let loadedCount = 0;

  // Size canvas to fill viewport
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", () => {
    resizeCanvas();
    drawFrame(Math.round(obj.frame));
  });

  const framePath = (i) => `assets/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;
  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = framePath(i);
    img.onload = () => {
      loadedCount++;
      if (loadedCount === 1) drawFrame(0);
    };
    images.push(img);
  }

  // Draw frame with cover-fit (fills entire canvas, crops excess)
  function drawFrame(idx) {
    if (!images[idx] || !images[idx].complete) return;
    const img = images[idx];
    const cw = canvas.width,
      ch = canvas.height;
    const iw = img.naturalWidth,
      ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale,
      dh = ih * scale;
    const dx = (cw - dw) / 2,
      dy = (ch - dh) / 2;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  const obj = { frame: 0 };
  gsap.to(obj, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.5 },
    onUpdate: () => drawFrame(Math.round(obj.frame)),
  });
}

// ── Hero Text Overlays ──
function initHeroTextAnimations() {
  const tl = gsap.timeline({ delay: 0.2 });
  tl.from(".hero-badge", {
    opacity: 0,
    y: -20,
    duration: 0.8,
    ease: "power3.out",
  })
    .from(
      ".hero-title-line",
      { opacity: 0, y: 40, duration: 0.8, stagger: 0.2, ease: "power3.out" },
      "-=0.4",
    )
    .from(
      ".hero-subtitle",
      { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" },
      "-=0.4",
    )
    .from(
      ".hero-specs-row",
      { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" },
      "-=0.4",
    )
    .from(
      ".hero-cta",
      { opacity: 0, scale: 0.9, duration: 0.8, ease: "back.out(1.5)" },
      "-=0.4",
    );

  gsap.to("#scrollIndicator", {
    opacity: 0,
    scrollTrigger: { start: 0, end: 300, scrub: true },
  });

  gsap.to(".hero-content", {
    opacity: 0,
    y: -100,
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}

// ══════════════════════════════════════════
// 3D MERRY-GO-ROUND CAROUSEL
// ══════════════════════════════════════════
function init3DCarousel() {
  const ring = qs("#carouselRing");
  const prevBtn = qs("#carouselPrev");
  const nextBtn = qs("#carouselNext");
  const dotsContainer = qs("#carouselDots");
  if (!ring || !dotsContainer) return;

  const watches = getWatches().filter(w => w.category === 'showcase');
  if (watches.length === 0) return;

  const N = watches.length;
  const step = 360 / N;
  const itemWidth = 280;
  let tz = 280;
  if (N !== 4) {
    tz = Math.max(200, Math.round((itemWidth / 2) / Math.tan(Math.PI / N)) + 40);
  }

  ring.innerHTML = watches.map((w, i) => `
    <div class="carousel-3d-item" style="--i:${i}; transform: rotateY(${i * step}deg) translateZ(${tz}px);">
      <div class="carousel-card">
        <div class="carousel-card-glow"></div>
        <img src="${w.image}" alt="${w.name}">
        <div class="carousel-card-info">
          <h3>${w.name}</h3>
          <p>${w.price}</p>
        </div>
      </div>
    </div>
  `).join('');

  dotsContainer.innerHTML = watches.map((_, i) => `<span class="carousel-dot"></span>`).join('');
  const dots = qsa(".carousel-dot");

  let currentAngle = 0;
  let currentIdx = 0;
  let autoRotating = true;

  // Pause auto-spin on hover
  ring.addEventListener("mouseenter", () => {
    autoRotating = false;
  });
  ring.addEventListener("mouseleave", () => {
    autoRotating = true;
  });

  function goTo(idx, isAuto = false) {
    if (!isAuto) {
      autoRotating = false;
      clearTimeout(ring._resumeTimer);
      ring._resumeTimer = setTimeout(() => {
        autoRotating = true;
      }, 5000);
    }

    let diff = idx - currentIdx;
    
    // Calculate shortest path based on N items
    const half = Math.floor(N / 2);
    if (diff > half) diff -= N;
    if (diff < -half) diff += N;

    currentIdx = ((idx % N) + N) % N;
    currentAngle -= diff * step;

    ring.style.transition = "transform 1s cubic-bezier(.16,1,.3,1)";
    ring.style.transform = `rotateY(${currentAngle}deg)`;
    setTimeout(() => {
      ring.style.transition = "";
    }, 1000);
    updateDots();
  }

  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle("active", i === currentIdx));
    qsa('.carousel-3d-item').forEach((item, i) => item.classList.toggle("front", i === currentIdx));
  }

  // Initialize first item as front
  updateDots();

  prevBtn.addEventListener("click", () => goTo(currentIdx - 1));
  nextBtn.addEventListener("click", () => goTo(currentIdx + 1));
  dots.forEach((d, i) => d.addEventListener("click", () => goTo(i)));

  // Auto-rotation interval
  setInterval(() => {
    if (autoRotating) {
      goTo(currentIdx + 1, true);
    }
  }, 3500);

  // GSAP entrance animation
  gsap.fromTo(
    ".carousel-3d-scene",
    { opacity: 0, scale: 0.7, rotateX: 20 },
    {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: { trigger: "#carousel3d", start: "top 75%" },
    },
  );
}

// ── Carousel Ambient Particles ──
function initCarouselParticles() {
  const canvas = qs("#carousel-particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w,
    h,
    particles = [];

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
  }
  resize();
  window.addEventListener("resize", resize);

  class P {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 1.8 + 0.3;
      this.speedY = -(Math.random() * 0.3 + 0.05);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.4 + 0.05;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      if (this.y < 0) {
        this.y = h;
        this.x = Math.random() * w;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(198,169,105,${this.opacity})`;
      ctx.fill();
    }
  }
  for (let i = 0; i < 40; i++) particles.push(new P());
  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ── Render Trending Watches ──
function renderTrending() {
  const track = qs("#trendingTrack");
  if (!track) return;
  const watches = getWatches().filter((w) => w.category === "trending");
  if (watches.length === 0) {
    track.innerHTML =
      '<div class="empty-state"><p>No trending watches yet. Add some from the admin panel.</p></div>';
    return;
  }
  track.innerHTML = watches
    .map(
      (w) => `
    <div class="trending-card" data-tilt>
      <div class="trending-card-img"><img src="${w.image}" alt="${w.name}" loading="lazy"></div>
      <div class="trending-card-info">
        <h3>${w.name}</h3>
        <div class="price">${w.price}</div>
      </div>
    </div>
  `,
    )
    .join("");
}

// ── Render Collection Grid ──
function renderCollection() {
  const grid = qs("#collectionGrid");
  if (!grid) return;
  const watches = getWatches().filter((w) => w.category === "collection");
  if (watches.length === 0) {
    grid.innerHTML =
      '<div class="empty-state"><p>No collection watches yet. Add some from the admin panel.</p></div>';
    return;
  }
  grid.innerHTML = watches
    .map(
      (w) => `
    <div class="collection-item reveal">
      <div class="collection-item-img">
        <img src="${w.image}" alt="${w.name}" loading="lazy">
        <div class="img-overlay"></div>
      </div>
      <div class="collection-item-info">
        <h3>${w.name}</h3>
        <p>${w.description}</p>
        <div class="price">${w.price}</div>
      </div>
    </div>
  `,
    )
    .join("");
}

// ── Scroll Reveal Animations ──
function initScrollAnimations() {
  qsa(".reveal").forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
        delay: (i % 3) * 0.12,
      },
    );
  });
  qsa(".collection-item").forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 50, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
        delay: (i % 4) * 0.1,
      },
    );
  });
  qsa(".trending-card").forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, x: 60 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: "#trending", start: "top 75%" },
        delay: i * 0.15,
      },
    );
  });
  qsa(".stat-num").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.5)",
        scrollTrigger: { trigger: el, start: "top 85%" },
      },
    );
  });
  const storyImg = qs(".story-image img");
  if (storyImg) {
    gsap.to(storyImg, {
      y: -40,
      ease: "none",
      scrollTrigger: {
        trigger: ".story-image",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }
}

// ── Story Image Reveal ──
function initStoryReveal() {
  const reveal = qs("#storyReveal");
  if (!reveal) return;
  gsap.to(reveal, {
    scaleX: 0,
    duration: 1.2,
    ease: "power3.inOut",
    scrollTrigger: {
      trigger: "#story",
      start: "top 65%",
      toggleActions: "play none none none",
    },
  });
}

// ── 3D Tilt on Cards ──
function initTiltCards() {
  qsa("[data-tilt], .collection-item").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px) scale(1.02)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(800px) rotateY(0) rotateX(0) translateY(0) scale(1)";
      card.style.transition = "transform 0.5s cubic-bezier(0.16,1,0.3,1)";
      setTimeout(() => (card.style.transition = ""), 500);
    });
  });
}

// ── Trending Horizontal Drag Scroll ──
function initTrendingDrag() {
  const track = qs("#trendingTrack");
  if (!track) return;
  let isDown = false,
    startX,
    scrollL;
  track.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - track.offsetLeft;
    scrollL = track.scrollLeft;
  });
  track.addEventListener("mouseleave", () => (isDown = false));
  track.addEventListener("mouseup", () => (isDown = false));
  track.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    track.scrollLeft = scrollL - (e.pageX - track.offsetLeft - startX) * 1.5;
  });
  track.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        track.scrollLeft += e.deltaY * 1.2;
      }
    },
    { passive: false },
  );
}

// ── Contact Form (UI only) ──
function initContactForm() {
  const form = qs("#contactForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector(".submit-btn");
    btn.textContent = "Message Sent ✓";
    btn.style.background = "var(--clr-gold)";
    setTimeout(() => {
      btn.textContent = "Send Message";
      btn.style.background = "";
      form.reset();
    }, 2500);
  });
}
