"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // 1. CUSTOM CURSOR
    const cursor = document.getElementById("cursor");
    const cursorGlow = document.getElementById("cursor-glow");
    let onMouseMove;
    let hoverElements = [];
    const addHover = () => document.body.classList.add("hover-interactive");
    const removeHover = () => document.body.classList.remove("hover-interactive");

    if (cursor && cursorGlow && window.matchMedia("(hover:hover)").matches) {
      const setCursorX = gsap.quickSetter(cursor, "x", "px");
      const setCursorY = gsap.quickSetter(cursor, "y", "px");
      const setGlowX = gsap.quickSetter(cursorGlow, "x", "px");
      const setGlowY = gsap.quickSetter(cursorGlow, "y", "px");

      onMouseMove = (e) => {
        setCursorX(e.clientX);
        setCursorY(e.clientY);
        gsap.to(cursorGlow, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.18,
          overwrite: "auto",
        });
      };
      window.addEventListener("mousemove", onMouseMove);

      hoverElements = Array.from(
        document.querySelectorAll("a, button, input, .masonry-item, .visit-card")
      );
      hoverElements.forEach((el) => {
        el.addEventListener("mouseenter", addHover);
        el.addEventListener("mouseleave", removeHover);
      });
    }

    // 2. NAVBAR SCROLL STATE
    const navbar = document.querySelector(".navbar");
    const onScroll = () => {
      if (navbar) {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
      }
    };
    window.addEventListener("scroll", onScroll);

    // 3. MOBILE MENU
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-links a");
    let isOpen = false;
    let toggleMenu;
    if (menuToggle && mobileMenu) {
      toggleMenu = () => {
        isOpen = !isOpen;
        mobileMenu.classList.toggle("active", isOpen);
        document.body.style.overflow = isOpen ? "hidden" : "";
        const bars = menuToggle.querySelectorAll(".bar");
        if (isOpen) {
          gsap.to(bars[0], { y: 7, rotate: 45, duration: 0.3 });
          gsap.to(bars[1], { rotate: -45, duration: 0.3 });
        } else {
          gsap.to(bars[0], { y: 0, rotate: 0, duration: 0.3 });
          gsap.to(bars[1], { rotate: 0, duration: 0.3 });
        }
      };
      menuToggle.addEventListener("click", toggleMenu);
      mobileLinks.forEach((l) => l.addEventListener("click", toggleMenu));
    }

    // 5. PRODUCT SHOWCASE & GSAP Context
    const ctx = gsap.context(() => {
      const slides = document.querySelectorAll(".product-slide");
      const glowEl = document.getElementById("stage-glow");
      const fillBar = document.getElementById("timeline-fill");
      const counterEl = document.getElementById("current-timeline-num");
      const TOTAL = slides.length;

      const glowColors = [
        "rgba(226,178,88,0.14)", // espresso — amber
        "rgba(200,150,80,0.12)", // latte — warm
        "rgba(80,130,200,0.12)", // iced — blue
        "rgba(92,173,106,0.13)", // matcha — green
        "rgba(220,90,90,0.12)",  // dessert — red/pink
        "rgba(0,210,255,0.12)", // cold brew — teal
      ];

      slides.forEach((s, i) => {
        const wrap = s.querySelector(".product-img-wrap");
        const title = s.querySelector(".product-title");
        const sub = s.querySelector(".product-sub");
        const details = s.querySelector(".product-details");
        const price = s.querySelector(".product-price");
        const quote = s.querySelector(".quote-big");

        if (i === 0) {
          s.classList.add("active");
          s.style.zIndex = 2;
          gsap.set(s, { opacity: 1 });
          gsap.set(wrap, { y: 0, x: 0, rotate: -8, scale: 1, opacity: 1 });
          gsap.set(title, { clipPath: "inset(0% 0% 0% 0%)" });
          if (sub) gsap.set(sub, { opacity: 1, y: 0 });
          if (details) gsap.set(details, { opacity: 1, y: 0 });
          if (price) gsap.set(price, { opacity: 1 });
          if (quote) gsap.set(quote, { x: 0, opacity: 1 });
        } else {
          s.classList.remove("active");
          s.style.zIndex = 1;
          gsap.set(s, { opacity: 0 });
          gsap.set(wrap, { y: 80, x: 30, rotate: 14, scale: 0.7, opacity: 0 });
          gsap.set(title, { clipPath: "inset(0% 0% 100% 0%)" });
          if (sub) gsap.set(sub, { opacity: 0, y: 16 });
          if (details) gsap.set(details, { opacity: 0, y: 10 });
          if (price) gsap.set(price, { opacity: 0 });
          if (quote) gsap.set(quote, { x: 60, opacity: 0 });
        }
      });

      if (glowEl) {
        glowEl.style.setProperty("--glow-color", glowColors[0]);
      }
      if (counterEl) {
        counterEl.textContent = "01";
      }
      if (fillBar) {
        fillBar.style.height = "0%";
      }
      let currentIdx = 0;

      if (document.querySelector(".showcase-section")) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".showcase-section",
            start: "top top",
            end: "+=500%",
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
            snap: {
              snapTo: 1 / (TOTAL - 1),
              duration: { min: 0.1, max: 0.4 },
              delay: 0.05,
              ease: "power2.out"
            },
            onUpdate: (self) => {
              const progress = self.progress;
              const newIdx = Math.max(
                0,
                Math.min(Math.round(progress * (TOTAL - 1)), TOTAL - 1)
              );
              if (newIdx !== currentIdx) {
                currentIdx = newIdx;
                if (counterEl) counterEl.textContent = `0${currentIdx + 1}`;
                slides.forEach((s, idx) => {
                  s.classList.toggle("active", idx === currentIdx);
                  s.style.zIndex = idx === currentIdx ? 2 : 1;
                });
              }
            },
          },
        });

        for (let i = 0; i < TOTAL - 1; i++) {
          const sCur = slides[i];
          const sNext = slides[i + 1];

          const wrapCur = sCur.querySelector(".product-img-wrap");
          const titleCur = sCur.querySelector(".product-title");
          const subCur = sCur.querySelector(".product-sub");
          const detailsCur = sCur.querySelector(".product-details");
          const priceCur = sCur.querySelector(".product-price");
          const quoteCur = sCur.querySelector(".quote-big");

          const wrapNext = sNext.querySelector(".product-img-wrap");
          const titleNext = sNext.querySelector(".product-title");
          const subNext = sNext.querySelector(".product-sub");
          const detailsNext = sNext.querySelector(".product-details");
          const priceNext = sNext.querySelector(".product-price");
          const quoteNext = sNext.querySelector(".quote-big");

          const transStart = i + 0.65;
          const transDuration = 0.35;

          // Outgoing slide animations
          tl.to(
            sCur,
            { opacity: 0, duration: transDuration * 0.8, ease: "power2.inOut" },
            transStart + transDuration * 0.2
          );
          tl.to(
            wrapCur,
            {
              y: -80,
              x: -30,
              rotate: -14,
              scale: 0.7,
              opacity: 0,
              duration: transDuration,
              ease: "power2.inOut",
            },
            transStart
          );
          tl.to(
            titleCur,
            { clipPath: "inset(0% 0% 100% 0%)", duration: transDuration * 0.8, ease: "power2.inOut" },
            transStart
          );
          if (subCur)
            tl.to(
              subCur,
              { opacity: 0, y: -16, duration: transDuration * 0.7, ease: "power2.inOut" },
              transStart
            );
          if (detailsCur)
            tl.to(
              detailsCur,
              { opacity: 0, y: -10, duration: transDuration * 0.7, ease: "power2.inOut" },
              transStart
            );
          if (priceCur)
            tl.to(
              priceCur,
              { opacity: 0, duration: transDuration * 0.7, ease: "power2.inOut" },
              transStart
            );
          if (quoteCur)
            tl.to(
              quoteCur,
              { x: -60, opacity: 0, duration: transDuration * 0.9, ease: "power2.inOut" },
              transStart
            );

          // Incoming slide animations
          tl.to(
            sNext,
            { opacity: 1, duration: transDuration * 0.8, ease: "power2.inOut" },
            transStart + transDuration * 0.15
          );
          tl.to(
            wrapNext,
            {
              y: 0,
              x: 0,
              rotate: -8,
              scale: 1,
              opacity: 1,
              duration: transDuration,
              ease: "power2.inOut",
            },
            transStart + transDuration * 0.15
          );
          tl.to(
            titleNext,
            { clipPath: "inset(0% 0% 0% 0%)", duration: transDuration * 0.9, ease: "power2.out" },
            transStart + transDuration * 0.2
          );
          if (subNext)
            tl.to(
              subNext,
              { opacity: 1, y: 0, duration: transDuration * 0.8, ease: "power2.out" },
              transStart + transDuration * 0.3
            );
          if (detailsNext)
            tl.to(
              detailsNext,
              { opacity: 1, y: 0, duration: transDuration * 0.8, ease: "power2.out" },
              transStart + transDuration * 0.35
            );
          if (priceNext)
            tl.to(
              priceNext,
              { opacity: 1, duration: transDuration * 0.7, ease: "power2.out" },
              transStart + transDuration * 0.4
            );
          if (quoteNext)
            tl.to(
              quoteNext,
              { x: 0, opacity: 1, duration: transDuration, ease: "power2.out" },
              transStart + transDuration * 0.2
            );

          if (fillBar) {
            const heightStart = (i / (TOTAL - 1)) * 100;
            const heightEnd = ((i + 1) / (TOTAL - 1)) * 100;
            tl.fromTo(
              fillBar,
              { height: `${heightStart}%` },
              { height: `${heightEnd}%`, duration: transDuration, ease: "none" },
              transStart
            );
          }
          if (glowEl) {
            tl.to(
              glowEl,
              { "--glow-color": glowColors[i + 1], duration: transDuration, ease: "power2.inOut" },
              transStart
            );
          }
        }
      }

      // 7. GALLERY — Masonry Scroll Reveal & Hover Tilt
      document.querySelectorAll(".masonry-item").forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              end: "top 60%",
              scrub: false,
            },
            duration: 0.7,
            ease: "power2.out",
          }
        );
      });

      // 8. ATMOSPHERE BANDS — Parallax & Reveal
      document.querySelectorAll(".atm-band").forEach((band) => {
        const img = band.querySelector(".atm-band-img");
        const speed = parseFloat(band.dataset.speed) || 1;
        gsap.fromTo(
          img,
          { yPercent: (speed - 1) * -20 },
          {
            yPercent: (speed - 1) * 20,
            scrollTrigger: {
              trigger: band,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
            ease: "none",
          }
        );
        gsap.fromTo(
          band,
          { opacity: 0 },
          {
            opacity: 1,
            scrollTrigger: {
              trigger: band,
              start: "top 85%",
              end: "top 50%",
              scrub: false,
            },
            duration: 0.8,
            ease: "power2.out",
          }
        );
      });

      // 9. VISIT SECTION — Reveal Animations
      document.querySelectorAll(".visit-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: { trigger: card, start: "top 88%", scrub: false },
            duration: 0.6,
            delay: i * 0.1,
            ease: "power2.out",
          }
        );
      });

      // 9b. REVIEWS SECTION — Reveal Animations
      document.querySelectorAll(".review-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: { trigger: card, start: "top 88%", scrub: false },
            duration: 0.6,
            delay: i * 0.1,
            ease: "power2.out",
          }
        );
      });

      // 11. SCROLL INDICATOR FADE
      const scrollInd = document.getElementById("scroll-indicator");
      if (scrollInd) {
        ScrollTrigger.create({
          trigger: ".hero",
          start: "top top",
          end: "200px top",
          onUpdate: (self) => {
            scrollInd.style.opacity = 1 - self.progress * 3;
          },
        });
      }

      // 12. SECTION HEADINGS REVEAL
      document.querySelectorAll(".section-title, .atm-header .section-title").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30, clipPath: "inset(0 0 100% 0)" },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            scrollTrigger: { trigger: el, start: "top 85%", scrub: false },
            duration: 0.9,
            ease: "power3.out",
          }
        );
      });
    });

    // 6. PRODUCT PARTICLE CANVASES (per product)
    const canvasCleanups = [];
    document.querySelectorAll(".particle-canvas").forEach((canvas) => {
      const type = canvas.dataset.type;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      let particles = [];
      let raf;

      const resize = () => {
        canvas.width = canvas.offsetWidth || 400;
        canvas.height = canvas.offsetHeight || 500;
      };
      resize();
      window.addEventListener("resize", resize);

      const W = () => canvas.width;
      const H = () => canvas.height;

      const createParticles = () => {
        particles = [];
        const n =
          type === "espresso"
            ? 18
            : type === "latte"
            ? 14
            : type === "iced"
            ? 24
            : type === "matcha"
            ? 20
            : type === "dessert"
            ? 16
            : 22;
        for (let i = 0; i < n; i++) {
          const p = {
            x: Math.random() * W(),
            y: Math.random() * H(),
            size: Math.random() * 4 + 1,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY:
              type === "espresso" || type === "latte"
                ? -(Math.random() * 0.6 + 0.2)
                : type === "matcha"
                ? -(Math.random() * 0.3 + 0.1)
                : (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.4 + 0.1,
            life: Math.random(),
            decay: Math.random() * 0.003 + 0.001,
          };
          particles.push(p);
        }
      };
      createParticles();

      const drawParticle = (p) => {
        ctx.save();
        ctx.globalAlpha = p.opacity * (1 - p.life);

        if (type === "espresso" || type === "latte") {
          ctx.fillStyle = "rgba(240,220,180,0.6)";
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size, p.size * 2.5, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === "iced" || type === "coldbrew") {
          ctx.fillStyle = "rgba(180,220,255,0.5)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === "matcha") {
          ctx.fillStyle = "rgba(140,210,140,0.4)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === "dessert") {
          ctx.fillStyle = "rgba(200,150,80,0.5)";
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.life * 6);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }

        ctx.restore();
      };

      const animate = () => {
        ctx.clearRect(0, 0, W(), H());
        particles.forEach((p) => {
          p.x += p.speedX;
          p.y += p.speedY;
          p.life += p.decay;
          if (p.life >= 1 || p.x < 0 || p.x > W() || p.y < -20) {
            p.x = Math.random() * W();
            p.y =
              type === "espresso" || type === "latte"
                ? H() * 0.7
                : Math.random() * H();
            p.life = 0;
            p.opacity = Math.random() * 0.4 + 0.1;
          }
          drawParticle(p);
        });
        raf = requestAnimationFrame(animate);
      };
      animate();

      canvasCleanups.push(() => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(raf);
      });
    });

    // 7. GALLERY — Masonry Hover Tilt Mouse Move
    const masonryCleanups = [];
    document.querySelectorAll(".masonry-item").forEach((item) => {
      const onMouseMove = (e) => {
        const rect = item.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(item, {
          rotateY: x * 10,
          rotateX: -y * 10,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      };
      const onMouseLeave = () => {
        gsap.to(item, { rotateY: 0, rotateX: 0, duration: 0.5, ease: "power2.out" });
      };
      item.addEventListener("mousemove", onMouseMove);
      item.addEventListener("mouseleave", onMouseLeave);

      masonryCleanups.push(() => {
        item.removeEventListener("mousemove", onMouseMove);
        item.removeEventListener("mouseleave", onMouseLeave);
      });
    });

    // 10. VIBE PLAYER
    const vibeBtn = document.getElementById("vibe-player-btn");
    const vibeAudio = document.getElementById("vibe-audio");
    let vibeOn = false;
    let handleVibeClick;
    if (vibeBtn && vibeAudio) {
      vibeAudio.volume = 0.45;
      handleVibeClick = () => {
        vibeOn = !vibeOn;
        if (vibeOn) {
          vibeAudio
            .play()
            .then(() => {
              vibeBtn.classList.add("active");
              const icon = vibeBtn.querySelector(".vibe-icon");
              const txt = vibeBtn.querySelector(".vibe-text");
              if (icon) icon.innerHTML = '<i class="fas fa-volume-up"></i>';
              if (txt) txt.textContent = "Vibe is Playing";
            })
            .catch(() => {
              vibeOn = false;
            });
        } else {
          vibeAudio.pause();
          vibeBtn.classList.remove("active");
          const icon = vibeBtn.querySelector(".vibe-icon");
          const txt = vibeBtn.querySelector(".vibe-text");
          if (icon) icon.innerHTML = '<i class="fas fa-volume-mute"></i>';
          if (txt) txt.textContent = "Listen to the Vibe";
        }
      };
      vibeBtn.addEventListener("click", handleVibeClick);
    }

    // 13. PRODUCT IMAGE SUBTLE MOUSE PARALLAX (Showcase)
    const showcaseEl = document.querySelector(".showcase-stage");
    let onShowcaseMouseMove, onShowcaseMouseLeave;
    if (showcaseEl) {
      onShowcaseMouseMove = (e) => {
        const rect = showcaseEl.getBoundingClientRect();
        const mx = (e.clientX - rect.left) / rect.width - 0.5;
        const my = (e.clientY - rect.top) / rect.height - 0.5;
        const activeImg = showcaseEl.querySelector(
          ".product-slide.active .product-img"
        );
        if (activeImg) {
          gsap.to(activeImg, {
            x: mx * 20,
            y: my * 12,
            duration: 0.8,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      };
      onShowcaseMouseLeave = () => {
        const activeImg = showcaseEl.querySelector(
          ".product-slide.active .product-img"
        );
        if (activeImg) {
          gsap.to(activeImg, { x: 0, y: 0, duration: 0.8, ease: "power2.out" });
        }
      };
      showcaseEl.addEventListener("mousemove", onShowcaseMouseMove);
      showcaseEl.addEventListener("mouseleave", onShowcaseMouseLeave);
    }

    return () => {
      ctx.revert();
      if (onMouseMove) window.removeEventListener("mousemove", onMouseMove);
      hoverElements.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
      window.removeEventListener("scroll", onScroll);
      if (menuToggle && toggleMenu)
        menuToggle.removeEventListener("click", toggleMenu);
      if (mobileLinks && toggleMenu)
        mobileLinks.forEach((l) => l.removeEventListener("click", toggleMenu));
      canvasCleanups.forEach((clean) => clean());
      masonryCleanups.forEach((clean) => clean());
      if (showcaseEl) {
        if (onShowcaseMouseMove)
          showcaseEl.removeEventListener("mousemove", onShowcaseMouseMove);
        if (onShowcaseMouseLeave)
          showcaseEl.removeEventListener("mouseleave", onShowcaseMouseLeave);
      }
      if (vibeBtn && handleVibeClick)
        vibeBtn.removeEventListener("click", handleVibeClick);
      if (vibeAudio) vibeAudio.pause();
    };
  }, []);

  return (
    <>
      {/* Custom Cursor */}
      <div className="custom-cursor" id="cursor"></div>
      <div className="custom-cursor-glow" id="cursor-glow"></div>

      {/* Navbar */}
      <nav className="navbar" id="navbar">
        <div className="nav-inner">
          <a href="#home" className="nav-logo">
            <img
              src="/assets/logo.jpg"
              alt="Underground 11"
              className="nav-logo-img"
            />
            <span className="nav-logo-text">
              Underground <em>11</em>
            </span>
          </a>
          <ul className="nav-links" id="nav-links">
            <li>
              <a href="#menu">Menu</a>
            </li>
            <li>
              <a href="#atmosphere">Atmosphere</a>
            </li>
            <li>
              <a href="#gallery">Gallery</a>
            </li>
            <li>
              <a href="#reviews">Reviews</a>
            </li>
            <li>
              <a href="#visit">Visit</a>
            </li>
          </ul>
          <div className="nav-right">
            <a href="#visit" className="nav-cta">
              Reserve a Table
            </a>
            <button
              className="mobile-menu-toggle"
              id="menu-toggle"
              aria-label="Menu"
            >
              <span className="bar"></span>
              <span className="bar"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="mobile-menu" id="mobile-menu">
        <div className="mobile-menu-inner">
          <ul className="mobile-links">
            <li>
              <a href="#menu">Menu</a>
            </li>
            <li>
              <a href="#atmosphere">Atmosphere</a>
            </li>
            <li>
              <a href="#gallery">Gallery</a>
            </li>
            <li>
              <a href="#reviews">Reviews</a>
            </li>
            <li>
              <a href="#visit">Visit</a>
            </li>
          </ul>
          <p className="mobile-menu-tag">Specialty Coffee · Late Night Vibes</p>
        </div>
      </div>

      {/* SECTION 1: HERO */}
      <header className="hero" id="home">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src="/assets/hero_underground.mp4" type="video/mp4" />
        </video>

        <div className="hero-bg"></div>

        <div className="hero-content">


          <h1 className="hero-title">
            <span className="hero-title-main">Underground 11</span>
            <br />
            <span className="hero-title-serif">
              C
              <span className="coffee-bean-o-wrap">
                <svg viewBox="0 0 100 100" className="coffee-bean-svg" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50,12 C68,12 78,28 78,50 C78,72 68,88 50,88 C32,88 22,72 22,50 C22,28 32,12 50,12 Z" fill="currentColor" />
                  <path d="M50,12 Q43,35 50,50 T50,88" fill="none" stroke="rgba(12,12,14,0.85)" strokeWidth="6" strokeLinecap="round" />
                </svg>
              </span>
              ffee Bar
            </span>
          </h1>
          <p className="hero-subtitle">
            Specialty coffee, signature desserts &amp; late-night cafe energy.
          </p>
          <div className="hero-ctas">
            <a href="#menu" className="btn-primary" id="hero-btn-menu">
              <span>Explore Menu</span>
              <i className="fas fa-arrow-right"></i>
            </a>
            <a href="#visit" className="btn-secondary" id="hero-btn-visit">
              Visit Us
            </a>
          </div>
        </div>

        <div className="scroll-indicator" id="scroll-indicator">
          <span className="scroll-text">Scroll to Explore</span>
          <div className="scroll-arrow">
            <div className="scroll-arrow-inner"></div>
          </div>
        </div>

        <div className="vibe-player" id="vibe-player">
          <button
            className="vibe-btn"
            id="vibe-player-btn"
            aria-label="Play ambient music"
          >
            <span className="vibe-icon">
              <i className="fas fa-volume-mute"></i>
            </span>
            <span className="vibe-text">Listen to the Vibe</span>
          </button>
          <audio id="vibe-audio" src="/assets/vibe.mp3" loop></audio>
        </div>
      </header>

      {/* SECTION 2: PRODUCT SHOWCASE */}
      <section className="showcase-section" id="menu">
        <div className="showcase-stage" id="showcase-stage">
          <div className="showcase-sidebar">
            <div className="sidebar-timeline">
              <div className="timeline-track">
                <div className="timeline-fill" id="timeline-fill"></div>
              </div>
            </div>
            <div className="sidebar-counter">
              <span className="counter-current" id="current-timeline-num">
                01
              </span>
              <span className="counter-sep">/</span>
              <span className="counter-total">06</span>
            </div>
          </div>

          <div className="stage-glow" id="stage-glow"></div>

          {/* Product 1 */}
          <div
            className="product-slide active"
            data-index="0"
            data-product="espresso"
          >
            <div
              className="slide-bg"
              style={{ "--slide-grain-opacity": 0.04 }}
            ></div>
            <div className="product-copy product-info-card">
              <span className="product-eyebrow">Signature Pour</span>
              <h2 className="product-title">
                Underground
                <br />
                Espresso
              </h2>
              <p className="product-sub">
                Triple-ristretto, aged 24h, served in hand-blown glass with
                crema that never quits.
              </p>
              <div className="product-details">
                <span className="detail-item">
                  <i className="fas fa-fire"></i> Double Shot
                </span>
                <span className="detail-item">
                  <i className="fas fa-thermometer-half"></i> 92°C Brew
                </span>
                <span className="detail-item">
                  <i className="fas fa-leaf"></i> Single Origin
                </span>
              </div>
            </div>
            <div className="product-scene product-image-wrapper">
              <canvas className="particle-canvas" data-type="espresso"></canvas>
              <div className="product-img-wrap">
                <img
                  src="/assets/cappuccino_logo.jpg"
                  alt="Underground Espresso"
                  className="product-img"
                  draggable="false"
                />
                <div className="product-light-left"></div>
                <div className="product-light-right"></div>
              </div>
            </div>
            <div className="product-quote">
              <span className="quote-big">
                {"\"THIS IS\""}
                <br />
                {"\"THE REAL\""}
                <br />
                {"\"THING\""}
              </span>
            </div>
          </div>

          {/* Product 2 */}
          <div className="product-slide" data-index="1" data-product="latte">
            <div className="slide-bg"></div>
            <div className="product-copy product-info-card">
              <span className="product-eyebrow">House Favourite</span>
              <h2 className="product-title">
                Velvet
                <br />
                Latte
              </h2>
              <p className="product-sub">
                Silky microfoam, oat milk base, hand-pulled espresso — served in
                a glass that glows amber under our bar lights.
              </p>
              <div className="product-details">
                <span className="detail-item">
                  <i className="fas fa-mug-hot"></i> Oat Milk
                </span>
                <span className="detail-item">
                  <i className="fas fa-star"></i> Bestseller
                </span>
                <span className="detail-item">
                  <i className="fas fa-award"></i> Award-winning
                </span>
              </div>
            </div>
            <div className="product-scene product-image-wrapper">
              <canvas className="particle-canvas" data-type="latte"></canvas>
              <div className="product-img-wrap">
                <img
                  src="/assets/glass_latte.jpg"
                  alt="Velvet Latte"
                  className="product-img"
                  draggable="false"
                />
                <div className="product-light-left"></div>
                <div className="product-light-right"></div>
              </div>
            </div>
            <div className="product-quote">
              <span className="quote-big">
                {"\"THIS AIN'T\""}
                <br />
                {"\"YOUR AVERAGE\""}
                <br />
                {"\"LATTE\""}
              </span>
            </div>
          </div>

          {/* Product 3 */}
          <div className="product-slide" data-index="2" data-product="iced">
            <div className="slide-bg"></div>
            <div className="product-copy product-info-card">
              <span className="product-eyebrow">Late Night Essential</span>
              <h2 className="product-title">
                Midnight
                <br />
                Iced
                <br />
                Americano
              </h2>
              <p className="product-sub">
                Cold-diluted espresso, hand-chipped ice, served in a 400ml
                glass. Dark, bold, unfiltered.
              </p>
              <div className="product-details">
                <span className="detail-item">
                  <i className="fas fa-snowflake"></i> Over Ice
                </span>
                <span className="detail-item">
                  <i className="fas fa-moon"></i> Night Special
                </span>
                <span className="detail-item">
                  <i className="fas fa-bolt"></i> Full Strength
                </span>
              </div>
            </div>
            <div className="product-scene product-image-wrapper">
              <canvas className="particle-canvas" data-type="iced"></canvas>
              <div className="product-img-wrap">
                <img
                  src="/assets/layered_drink.jpg"
                  alt="Midnight Iced Americano"
                  className="product-img"
                  draggable="false"
                />
                <div className="product-light-left"></div>
                <div className="product-light-right"></div>
              </div>
            </div>
            <div className="product-quote">
              <span className="quote-big">
                {"\"DARK\""}
                <br />
                {"\"COLD\""}
                <br />
                {"\"UNFILTERED\""}
              </span>
            </div>
          </div>

          {/* Product 4 */}
          <div className="product-slide" data-index="3" data-product="matcha">
            <div className="slide-bg"></div>
            <div className="product-copy product-info-card">
              <span className="product-eyebrow">Zen Ritual</span>
              <h2 className="product-title">
                Matcha
                <br />
                Glow
              </h2>
              <p className="product-sub">
                Ceremonial grade matcha, oat milk whip, gold flake — handcrafted
                to glow as green as good days.
              </p>
              <div className="product-details">
                <span className="detail-item">
                  <i className="fas fa-leaf"></i> Ceremonial Grade
                </span>
                <span className="detail-item">
                  <i className="fas fa-seedling"></i> Vegan
                </span>
                <span className="detail-item">
                  <i className="fas fa-sun"></i> Mood Lifter
                </span>
              </div>
            </div>
            <div className="product-scene product-image-wrapper">
              <canvas className="particle-canvas" data-type="matcha"></canvas>
              <div className="product-img-wrap">
                <img
                  src="/assets/matcha_drinks.jpg"
                  alt="Matcha Glow"
                  className="product-img"
                  draggable="false"
                />
                <div className="product-light-left"></div>
                <div className="product-light-right"></div>
              </div>
            </div>
            <div className="product-quote">
              <span className="quote-big">
                {"\"GREEN\""}
                <br />
                {"\"IS THE\""}
                <br />
                {"\"NEW BLACK\""}
              </span>
            </div>
          </div>

          {/* Product 5 */}
          <div className="product-slide" data-index="4" data-product="dessert">
            <div className="slide-bg"></div>
            <div className="product-copy product-info-card">
              <span className="product-eyebrow">Patisserie</span>
              <h2 className="product-title">
                Strawberry
                <br />
                Caramel
                <br />
                Cake
              </h2>
              <p className="product-sub">
                House-baked daily. Layers of caramel sponge, fresh strawberry
                compote, and whipped mascarpone cream.
              </p>
              <div className="product-details">
                <span className="detail-item">
                  <i className="fas fa-birthday-cake"></i> House Baked
                </span>
                <span className="detail-item">
                  <i className="fas fa-clock"></i> Daily Fresh
                </span>
                <span className="detail-item">
                  <i className="fas fa-heart"></i> Limited
                </span>
              </div>
            </div>
            <div className="product-scene product-image-wrapper">
              <canvas className="particle-canvas" data-type="dessert"></canvas>
              <div className="product-img-wrap">
                <img
                  src="/assets/strawberry_cake.jpg"
                  alt="Strawberry Caramel Cake"
                  className="product-img"
                  draggable="false"
                />
                <div className="product-light-left"></div>
                <div className="product-light-right"></div>
              </div>
            </div>
            <div className="product-quote">
              <span className="quote-big">
                {"\"WORTH\""}
                <br />
                {"\"EVERY\""}
                <br />
                {"\"CALORIE\""}
              </span>
            </div>
          </div>

          {/* Product 6 */}
          <div
            className="product-slide"
            data-index="5"
            data-product="coldbrew"
          >
            <div className="slide-bg"></div>
            <div className="product-copy product-info-card">
              <span className="product-eyebrow">Signature Brew</span>
              <h2 className="product-title">
                Cold Brew
                <br />
                No. 11
              </h2>
              <p className="product-sub">
                18-hour slow-steeped cold brew, strained twice, served with mint
                cold foam and a citrus peel. Underground's crown jewel.
              </p>
              <div className="product-details">
                <span className="detail-item">
                  <i className="fas fa-hourglass-half"></i> 18hr Steep
                </span>
                <span className="detail-item">
                  <i className="fas fa-crown"></i> Signature
                </span>
                <span className="detail-item">
                  <i className="fas fa-snowflake"></i> Served Cold
                </span>
              </div>
            </div>
            <div className="product-scene product-image-wrapper">
              <canvas className="particle-canvas" data-type="coldbrew"></canvas>
              <div className="product-img-wrap">
                <img
                  src="/assets/cold_brew_mint.jpg"
                  alt="Cold Brew No. 11"
                  className="product-img"
                  draggable="false"
                />
                <div className="product-light-left"></div>
                <div className="product-light-right"></div>
              </div>
            </div>
            <div className="product-quote">
              <span className="quote-big">
                {"\"18 HOURS\""}
                <br />
                {"\"OF PURE\""}
                <br />
                {"\"PATIENCE\""}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ATMOSPHERE */}
      <section className="atmosphere-section" id="atmosphere">
        <div className="atm-header">
          <span className="section-eyebrow">The Space</span>
          <h2 className="section-title">Feel the Underground</h2>
          <p className="section-sub">
            Where baristas become artists and every corner tells a story.
          </p>
        </div>

        <div className="atm-bands">
          <div className="atm-band" data-speed="1.08">
            <div
              className="atm-band-img"
              style={{ backgroundImage: "url('/assets/bar_counter.jpg')" }}
            ></div>
            <div className="atm-band-overlay">
              <div className="atm-led-line"></div>
              <div className="atm-amber-leak"></div>
            </div>
            <div className="atm-band-caption">
              <span>The Bar Counter</span>
            </div>
          </div>

          <div className="atm-band atm-band-right" data-speed="0.92">
            <div
              className="atm-band-img"
              style={{ backgroundImage: "url('/assets/barista_station.jpg')" }}
            ></div>
            <div className="atm-band-overlay">
              <div className="atm-led-line"></div>
            </div>
            <div className="atm-band-caption">
              <span>The Barista Station</span>
            </div>
          </div>

          <div className="atm-band" data-speed="1.04">
            <div
              className="atm-band-img"
              style={{ backgroundImage: "url('/assets/lounge_arches.jpg')" }}
            ></div>
            <div className="atm-band-overlay">
              <div className="atm-glass-reflection"></div>
              <div className="atm-amber-leak"></div>
            </div>
            <div className="atm-band-caption">
              <span>The Lounge</span>
            </div>
          </div>

          <div className="atm-band atm-band-right" data-speed="0.96">
            <div
              className="atm-band-img"
              style={{ backgroundImage: "url('/assets/brewing_shelves.jpg')" }}
            ></div>
            <div className="atm-band-overlay">
              <div className="atm-led-line"></div>
            </div>
            <div className="atm-band-caption">
              <span>The Brew Shelves</span>
            </div>
          </div>
        </div>

        <div className="atm-quote-bar">
          <p className="atm-quote">
            {
              "\"A place where the espresso is always strong and the conversations never end.\""
            }
          </p>
          <span className="atm-quote-attr">
            {"— Underground 11, Est. Always"}
          </span>
        </div>
      </section>

      {/* SECTION 4: GALLERY */}
      <section className="gallery-section" id="gallery">
        <div className="gallery-header">
          <span className="section-eyebrow">Life at Underground</span>
          <h2 className="section-title">Gallery</h2>
        </div>

        <div className="masonry-grid" id="masonry-grid">
          <div className="masonry-item masonry-tall">
            <img src="/assets/latte_hand.jpg" alt="Latte pour" loading="lazy" />
            <div className="masonry-caption">The Perfect Pour</div>
          </div>
          <div className="masonry-item">
            <img
              src="/assets/floral_latte.jpg"
              alt="Floral latte"
              loading="lazy"
            />
            <div className="masonry-caption">Floral Latte Art</div>
          </div>
          <div className="masonry-item masonry-wide">
            <img src="/assets/coffee_tray.jpg" alt="Coffee tray" loading="lazy" />
            <div className="masonry-caption">The Full Experience</div>
          </div>
          <div className="masonry-item">
            <img
              src="/assets/flower_cookie.jpg"
              alt="Flower cookie"
              loading="lazy"
            />
            <div className="masonry-caption">Pastry of the Day</div>
          </div>
          <div className="masonry-item masonry-tall">
            <img
              src="/assets/indoor_seating.jpg"
              alt="Indoor seating"
              loading="lazy"
            />
            <div className="masonry-caption">The Inner Circle</div>
          </div>
          <div className="masonry-item">
            <img
              src="/assets/takeaway_cup.jpg"
              alt="Takeaway cup"
              loading="lazy"
            />
            <div className="masonry-caption">On The Go</div>
          </div>
          <div className="masonry-item">
            <img src="/assets/tray_combo.jpg" alt="Tray combo" loading="lazy" />
            <div className="masonry-caption">The Full Set</div>
          </div>
          <div className="masonry-item masonry-wide">
            <img
              src="/assets/balcony_lounge.jpg"
              alt="Balcony lounge"
              loading="lazy"
            />
            <div className="masonry-caption">Balcony Vibes</div>
          </div>
          <div className="masonry-item">
            <img
              src="/assets/espresso_sticker.jpg"
              alt="Espresso"
              loading="lazy"
            />
            <div className="masonry-caption">The Daily Ritual</div>
          </div>
          <div className="masonry-item masonry-tall">
            <img
              src="/assets/interior_plant.jpg"
              alt="Interior plant"
              loading="lazy"
            />
            <div className="masonry-caption">Urban Greenery</div>
          </div>
          <div className="masonry-item">
            <img
              src="/assets/biscoff_cheesecake.jpg"
              alt="Biscoff cheesecake"
              loading="lazy"
            />
            <div className="masonry-caption">Biscoff Dreams</div>
          </div>
          <div className="masonry-item">
            <img src="/assets/affogato.jpg" alt="Affogato" loading="lazy" />
            <div className="masonry-caption">Affogato Hour</div>
          </div>
        </div>
      </section>

      {/* SECTION: CLIENT REVIEWS */}
      <section className="reviews-section" id="reviews">
        <div className="reviews-header">
          <span className="section-eyebrow">Reviews</span>
          <h2 className="section-title">Client reviews</h2>
        </div>

        <div className="reviews-grid">
          <div className="review-card">
            <span className="review-quote-icon">“</span>
            <div>
              <div className="review-stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="review-text">
                {"\"The late-night vibes here are unmatched. Their cold brew is easily the best in Mangaluru, and the music sets the perfect mood.\""}
              </p>
            </div>
            <div className="review-author">
              <div className="review-avatar-placeholder">AK</div>
              <div className="review-author-info">
                <h4>Aditya K.</h4>
                <span>Local Guide</span>
              </div>
            </div>
          </div>

          <div className="review-card">
            <span className="review-quote-icon">“</span>
            <div>
              <div className="review-stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="review-text">
                {"\"Underground 11 is a hidden gem. The attention to detail in their coffee and the velvet latte is incredible. An absolute must-visit!\""}
              </p>
            </div>
            <div className="review-author">
              <div className="review-avatar-placeholder">RD</div>
              <div className="review-author-info">
                <h4>Rhea D.</h4>
                <span>Coffee Connoisseur</span>
              </div>
            </div>
          </div>

          <div className="review-card">
            <span className="review-quote-icon">“</span>
            <div>
              <div className="review-stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="review-text">
                {"\"A perfect place to unwind. Love the aesthetic, the silent lofi beats, and the strawberry caramel cake. My favorite late-night spot.\""}
              </p>
            </div>
            <div className="review-author">
              <div className="review-avatar-placeholder">NS</div>
              <div className="review-author-info">
                <h4>Nikhil S.</h4>
                <span>Regular Customer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: VISIT */}
      <section className="visit-section" id="visit">
        <div className="visit-watermark">Underground 11</div>

        <div className="visit-inner">
          <div className="visit-header">
            <span className="section-eyebrow">Find Us</span>
            <h2 className="section-title visit-title">
              Come
              <br />
              Visit Us
            </h2>
          </div>

          <div className="visit-grid">
            <div className="visit-card">
              <div className="visit-card-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3 className="visit-card-title">Location</h3>
              <p className="visit-card-body">
                Underground 11 Coffee Bar
                <br />
                Ground Floor, Mindspace Building
                <br />
                Airport Road, Yeyyadi, Mangaluru
              </p>
              <a
                href="https://maps.google.com/?q=Underground+11+Coffee+Bar+Yeyyadi+Mangaluru"
                target="_blank"
                className="visit-link neon-link"
                style={{ marginBottom: "24px", display: "inline-flex" }}
              >
                Get Directions <i className="fas fa-external-link-alt"></i>
              </a>
              <div
                className="booking-section"
                style={{
                  marginTop: "24px",
                  borderTop: "1px solid var(--border)",
                  paddingTop: "24px",
                }}
              >
                <span
                  className="detail-label"
                  style={{
                    display: "block",
                    fontSize: "0.72rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--txt-muted)",
                    marginBottom: "12px",
                  }}
                >
                  Book Online Via
                </span>
                <div
                  className="partner-bookings"
                  style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
                >
                  <a
                    href="https://www.swiggy.com/dineout"
                    target="_blank"
                    className="partner-btn partner-swiggy"
                  >
                    <i className="fas fa-utensils"></i> Swiggy Dineout
                  </a>

                </div>
              </div>
            </div>

            <div className="visit-card">
              <div className="visit-card-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3 className="visit-card-title">Hours</h3>
              <div className="hours-list">
                <div className="hours-row">
                  <span>Mon – Thu</span>
                  <span>9 AM – 1 AM</span>
                </div>
                <div className="hours-row">
                  <span>Fri – Sat</span>
                  <span>9 AM – 3 AM</span>
                </div>
                <div className="hours-row">
                  <span>Sunday</span>
                  <span>10 AM – 11 PM</span>
                </div>
              </div>
            </div>

            <div className="visit-card">
              <div className="visit-card-icon">
                <i className="fab fa-instagram"></i>
              </div>
              <h3 className="visit-card-title">Social</h3>
              <p className="visit-card-body">
                {
                  "See what's brewing daily. Stories, reels, and behind-the-bar content every day."
                }
              </p>
              <a
                href="https://www.instagram.com/underground11_coffeebar"
                target="_blank"
                className="visit-link neon-link instagram-link"
              >
                <i className="fab fa-instagram"></i> @underground11_coffeebar
              </a>
            </div>

            <div className="visit-card visit-card-map">
              <div className="map-placeholder">
                <div className="map-pin-anim">
                  <i className="fas fa-map-marker-alt map-pin"></i>
                  <div className="map-ping"></div>
                </div>
                <p>
                  Underground 11
                  <br />
                  Coffee Bar
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img
              src="/assets/logo.jpg"
              alt="Underground 11"
              className="footer-logo"
            />
            <p>
              Underground 11 Coffee Bar
              <br />
              <em>Specialty Coffee &amp; Late-Night Vibes</em>
            </p>
          </div>
          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#menu">Menu</a>
            <a href="#atmosphere">Atmosphere</a>
            <a href="#gallery">Gallery</a>
            <a href="#visit">Visit</a>
          </div>
          <div className="footer-social">
            <a
              href="https://www.instagram.com/underground11_coffeebar"
              target="_blank"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Underground 11 Coffee Bar. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}
