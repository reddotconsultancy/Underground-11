"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const [goingUndergroundSize, setGoingUndergroundSize] = useState("M");
  const [hypnoticBrewSize, setHypnoticBrewSize] = useState("M");

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
        "rgba(166,120,80,0.14)", // tiramisu — cocoa brown
        "rgba(100,80,60,0.12)",  // cold brew — coffee brown
        "rgba(226,178,88,0.14)", // rum barrel — smoky gold
        "rgba(92,173,106,0.15)", // strawberry matcha — matcha green
        "rgba(240,230,200,0.13)", // vietnamese latte — condensed milk cream
        "rgba(120,200,120,0.14)", // coconut cloud matcha — cool coconut matcha green
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
              UNDERGROUND <em>11</em>
            </span>
          </a>
          <ul className="nav-links" id="nav-links">
            <li>
              <a href="#about">About</a>
            </li>
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
            <a href="#merch" className="nav-cta nav-cta-secondary" style={{ marginRight: "12px" }}>
              Shop Merch
            </a>
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
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#menu">Menu</a>
            </li>
            <li>
              <a href="#atmosphere">Atmosphere</a>
            </li>
            <li>
              <a href="#merch">Merchandise</a>
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
          <p className="mobile-menu-tag">Specialty Coffee · Handcrafted Brews · Cozy Vibes</p>
        </div>
      </div>

      {/* SECTION 1: HERO */}
      <header className="hero" id="home">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src="/assets/hero_underground.mp4" type="video/mp4" />
        </video>

        <div className="hero-bg"></div>

        <div className="hero-content">
          <div className="hero-eyebrow">
            <span>Specialty Coffee &amp; Handcrafted Brews</span>
          </div>

          <h1 className="hero-title">
            <span className="hero-title-main">UNDERGROUND 11</span>
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
            Specialty coffee, house-baked pastries, curated lofi night vibes music &amp; chill cafe energy.
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

      {/* SECTION: ABOUT */}
      <section className="about-section" id="about">
        <div className="about-glow-backdrop"></div>
        <div className="about-grid">
          <div className="about-content">
            <span className="section-eyebrow">Our Story</span>
            <h2 className="section-title">A Space for <em>Connection</em></h2>
            <div className="about-text-glow">
              Born from a love for specialty coffee, slow-baked pastries, and lofi beats.
            </div>
            <p className="about-desc-p">
              UNDERGROUND 11 is a moody, hidden sanctuary designed for those who appreciate the finer details of coffee craftsmanship. We serve premium Uji matcha, slow-steeped signature cold brews, and classic espresso drinks made with carefully sourced beans.
            </p>
            <p className="about-desc-p">
              Our space is more than just a coffee bar; it is an evening escape. Whether you are catching up with friends, working in a cozy corner, or simply winding down your day, our curated atmosphere and lofi soundtracks provide the perfect backdrop for connection.
            </p>
          </div>
          <div className="about-image-column">
            <div className="about-img-wrap">
              <img
                src="/assets/gal_interior.jpg"
                alt="UNDERGROUND 11 Lounge Interior"
                className="about-img"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

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

          {/* Product 1 — Tiramisu Latte */}
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
              <span className="product-eyebrow">Layered Special</span>
              <span className="product-num">01 //</span>
              <h2 className="product-title">
                Tiramisu
                <br />
                <em>Latte</em>
              </h2>
              <p className="product-sub">
                Creamy, layered dessert coffee. A double shot of bold espresso poured over cold, velvety milk and sweet cream, finished with a heavy dusting of cocoa powder and a dusted rim.
              </p>
              <div className="product-details">
                <span className="detail-item">
                  <i className="fas fa-mug-hot"></i> Espresso &amp; Milk
                </span>
                <span className="detail-item">
                  <i className="fas fa-ice-cream"></i> Creamy Layer
                </span>
                <span className="detail-item">
                  <i className="fas fa-cookie"></i> Cocoa Dusted
                </span>
              </div>
            </div>
            <div className="product-scene product-image-wrapper">
              <canvas className="particle-canvas" data-type="latte"></canvas>
              <div className="product-img-wrap">
                <img
                  src="/assets/tiramisu_latte.jpg"
                  alt="Underground Tiramisu Latte"
                  className="product-img"
                  draggable="false"
                />
                <div className="product-light-left"></div>
                <div className="product-light-right"></div>
              </div>
            </div>
            <div className="product-quote">
              <span className="quote-big">
                {"\"COFFEE\""}
                <br />
                {"\"MEETS\""}
                <br />
                {"\"DESSERT\""}
              </span>
            </div>
          </div>

          {/* Product 2 — Cold Brew */}
          <div className="product-slide" data-index="1" data-product="coldbrew">
            <div className="slide-bg"></div>
            <div className="product-copy product-info-card">
              <span className="product-eyebrow">Signature Brew</span>
              <span className="product-num">02 //</span>
              <h2 className="product-title">
                Signature
                <br />
                <em>Cold Brew</em>
              </h2>
              <p className="product-sub">
                Bold, slow-steeped specialty cold brew coffee served over ice. Crystal clear, refreshing, and deeply flavorful with a smooth chocolatey finish.
              </p>
              <div className="product-details">
                <span className="detail-item">
                  <i className="fas fa-snowflake"></i> Served Ice Cold
                </span>
                <span className="detail-item">
                  <i className="fas fa-hourglass-half"></i> 18hr Steep
                </span>
                <span className="detail-item">
                  <i className="fas fa-tint"></i> Smooth Finish
                </span>
              </div>
            </div>
            <div className="product-scene product-image-wrapper">
              <canvas className="particle-canvas" data-type="coldbrew"></canvas>
              <div className="product-img-wrap">
                <img
                  src="/assets/cold_brew_premium.jpg"
                  alt="Underground Signature Cold Brew"
                  className="product-img"
                  draggable="false"
                />
                <div className="product-light-left"></div>
                <div className="product-light-right"></div>
              </div>
            </div>
            <div className="product-quote">
              <span className="quote-big">
                {"\"PURE\""}
                <br />
                {"\"SLOW\""}
                <br />
                {"\"REFRESHMENT\""}
              </span>
            </div>
          </div>

          {/* Product 3 — Rum Barrel Rosemary Smoke */}
          <div className="product-slide" data-index="2" data-product="iced">
            <div className="slide-bg"></div>
            <div className="product-copy product-info-card">
              <span className="product-eyebrow">Sensory Infusion</span>
              <span className="product-num">03 //</span>
              <h2 className="product-title">
                Rum Barrel
                <br />
                <em>Rosemary Smoke</em>
              </h2>
              <p className="product-sub">
                Specialty cold brew aged in oak rum barrels, infused with aromatic rosemary wood smoke under a custom wooden lid. A sensory, smoky experience with rich barrel-aged notes.
              </p>
              <div className="product-details">
                <span className="detail-item">
                  <i className="fas fa-wind"></i> Rosemary Smoke
                </span>
                <span className="detail-item">
                  <i className="fas fa-history"></i> Oak Aged
                </span>
                <span className="detail-item">
                  <i className="fas fa-magic"></i> Sensory Serve
                </span>
              </div>
            </div>
            <div className="product-scene product-image-wrapper">
              <canvas className="particle-canvas" data-type="iced"></canvas>
              <div className="product-img-wrap">
                <img
                  src="/assets/rum_barrel_smoke.jpg"
                  alt="Rum Barrel Cold Brew Rosemary Smoke"
                  className="product-img"
                  draggable="false"
                />
                <div className="product-light-left"></div>
                <div className="product-light-right"></div>
              </div>
            </div>
            <div className="product-quote">
              <span className="quote-big">
                {"\"OAK\""}
                <br />
                {"\"BARREL\""}
                <br />
                {"\"SMOKE\""}
              </span>
            </div>
          </div>

          {/* Product 4 — Strawberry Matcha */}
          <div className="product-slide" data-index="3" data-product="matcha">
            <div className="slide-bg"></div>
            <div className="product-copy product-info-card">
              <span className="product-eyebrow">Zen Fusion</span>
              <span className="product-num">04 //</span>
              <h2 className="product-title">
                Strawberry
                <br />
                <em>Matcha</em>
              </h2>
              <p className="product-sub">
                A beautiful tri-layer iced drink combining sweet strawberry compote at the base, silky cold milk in the middle, and premium whisked Uji ceremonial matcha at the top.
              </p>
              <div className="product-details">
                <span className="detail-item">
                  <i className="fas fa-leaf"></i> Uji Matcha
                </span>
                <span className="detail-item">
                  <i className="fas fa-seedling"></i> Strawberry Puree
                </span>
                <span className="detail-item">
                  <i className="fas fa-palette"></i> Tri-Layered
                </span>
              </div>
            </div>
            <div className="product-scene product-image-wrapper">
              <canvas className="particle-canvas" data-type="matcha"></canvas>
              <div className="product-img-wrap">
                <img
                  src="/assets/strawberry_matcha.jpg"
                  alt="Underground Strawberry Matcha"
                  className="product-img"
                  draggable="false"
                />
                <div className="product-light-left"></div>
                <div className="product-light-right"></div>
              </div>
            </div>
            <div className="product-quote">
              <span className="quote-big">
                {"\"VIBRANT\""}
                <br />
                {"\"LAYERS\""}
                <br />
                {"\"OF ART\""}
              </span>
            </div>
          </div>

          {/* Product 5 — Vietnamese Latte */}
          <div className="product-slide" data-index="4" data-product="dessert">
            <div className="slide-bg"></div>
            <div className="product-copy product-info-card">
              <span className="product-eyebrow">Indulgent Classic</span>
              <span className="product-num">05 //</span>
              <h2 className="product-title">
                Vietnamese
                <br />
                <em>Latte</em>
              </h2>
              <p className="product-sub">
                Strong, sweet, and silky, Vietnamese Latte blends bold espresso with creamy condensed milk for a smooth, indulgent hit of caffeine with unmistakable character.
              </p>
              <div className="product-details">
                <span className="detail-item">
                  <i className="fas fa-coffee"></i> Vietnamese Brew
                </span>
                <span className="detail-item">
                  <i className="fas fa-tint"></i> Condensed Milk
                </span>
                <span className="detail-item">
                  <i className="fas fa-bolt"></i> Bold Character
                </span>
              </div>
            </div>
            <div className="product-scene product-image-wrapper">
              <canvas className="particle-canvas" data-type="espresso"></canvas>
              <div className="product-img-wrap">
                <img
                  src="/assets/vietnamese_latte.jpg"
                  alt="Underground Vietnamese Latte"
                  className="product-img"
                  draggable="false"
                />
                <div className="product-light-left"></div>
                <div className="product-light-right"></div>
              </div>
            </div>
            <div className="product-quote">
              <span className="quote-big">
                {"\"STRONG\""}
                <br />
                {"\"SWEET\""}
                <br />
                {"\"SILKY\""}
              </span>
            </div>
          </div>

          {/* Product 6 — Coconut Cloud Matcha */}
          <div
            className="product-slide"
            data-index="5"
            data-product="matcha"
          >
            <div className="slide-bg"></div>
            <div className="product-copy product-info-card">
              <span className="product-eyebrow">Zen Special</span>
              <span className="product-num">06 //</span>
              <h2 className="product-title">
                Coconut Cloud
                <br />
                <em>Matcha</em>
              </h2>
              <p className="product-sub">
                Clean, refreshing coconut water layered with a sweet, fluffy vanilla cold foam cloud and topped with a vibrant, whisked Uji ceremonial grade matcha layer.
              </p>
              <div className="product-details">
                <span className="detail-item">
                  <i className="fas fa-leaf"></i> Ceremonial Matcha
                </span>
                <span className="detail-item">
                  <i className="fas fa-cloud"></i> Vanilla Cloud Foam
                </span>
                <span className="detail-item">
                  <i className="fas fa-tint"></i> Pure Coconut Water
                </span>
              </div>
            </div>
            <div className="product-scene product-image-wrapper">
              <canvas className="particle-canvas" data-type="matcha"></canvas>
              <div className="product-img-wrap">
                <img
                  src="/assets/coconut_matcha.jpg"
                  alt="Coconut Cloud Matcha"
                  className="product-img"
                  draggable="false"
                />
                <div className="product-light-left"></div>
                <div className="product-light-right"></div>
              </div>
            </div>
            <div className="product-quote">
              <span className="quote-big">
                {"\"CLEAN\""}
                <br />
                {"\"LIGHT\""}
                <br />
                {"\"REFRESHING\""}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ATMOSPHERE */}
      <section className="atmosphere-section" id="atmosphere">
        <div className="atm-header">
          <span className="section-eyebrow">The Space</span>
          <h2 className="section-title">Feel the <em>UNDERGROUND</em></h2>
          <p className="section-sub">
            Where baristas become artists, freshly baked pastries fuel your day, and
            curated lofi music sets the perfect cafe mood.
          </p>
        </div>

        <div className="atm-bands">
          {/* 1. Bar Counter */}
          <div className="atm-band" data-speed="1.08">
            <div
              className="atm-band-blur"
              style={{ backgroundImage: "url('/assets/atm_counter.jpg')" }}
            ></div>
            <div className="atm-band-img-wrap">
              <img
                src="/assets/atm_counter.jpg"
                alt="The Bar Counter"
                className="atm-band-img"
              />
            </div>
            <div className="atm-band-overlay">
              <div className="atm-led-line"></div>
              <div className="atm-amber-leak"></div>
            </div>
            <div className="atm-band-caption">
              <span>The Bar Counter</span>
            </div>
          </div>

          {/* 2. Cozy Seating */}
          <div className="atm-band atm-band-right" data-speed="0.92">
            <div
              className="atm-band-blur"
              style={{ backgroundImage: "url('/assets/atm_lounge.jpg')" }}
            ></div>
            <div className="atm-band-img-wrap">
              <img
                src="/assets/atm_lounge.jpg"
                alt="The Cozy Seating"
                className="atm-band-img"
              />
            </div>
            <div className="atm-band-overlay">
              <div className="atm-led-line"></div>
              <div className="atm-glass-reflection"></div>
            </div>
            <div className="atm-band-caption">
              <span>The Cozy Seating</span>
            </div>
          </div>

          {/* 3. Display Showcase */}
          <div className="atm-band" data-speed="1.05">
            <div
              className="atm-band-blur"
              style={{ backgroundImage: "url('/assets/atm_barista_wide.jpg')" }}
            ></div>
            <div className="atm-band-img-wrap">
              <img
                src="/assets/atm_barista_wide.jpg"
                alt="The Display Showcase"
                className="atm-band-img"
              />
            </div>
            <div className="atm-band-overlay">
              <div className="atm-led-line"></div>
              <div className="atm-amber-leak"></div>
            </div>
            <div className="atm-band-caption">
              <span>The Display Showcase</span>
            </div>
          </div>

          {/* 4. Brew Shelves */}
          <div className="atm-band atm-band-right" data-speed="0.95">
            <div
              className="atm-band-blur"
              style={{ backgroundImage: "url('/assets/atm_shelves.jpg')" }}
            ></div>
            <div className="atm-band-img-wrap">
              <img
                src="/assets/atm_shelves.jpg"
                alt="The Brew Shelves"
                className="atm-band-img"
              />
            </div>
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
            {"— UNDERGROUND 11, Est. Always"}
          </span>
        </div>
      </section>

      {/* SECTION 3.5: MERCHANDISE */}
      <section className="merch-section" id="merch">
        <div className="merch-header">
          <span className="section-eyebrow">The Gear</span>
          <h2 className="section-title">UNDERGROUND <em>Merch</em></h2>
          <p className="section-sub">
            Wear the vibe. High-quality limited edition apparel and accessories crafted for coffee purists.
          </p>
        </div>

        <div className="merch-container">
          {/* Loop reels videos showcasing merch in vertical frames */}
          <div className="merch-showcase-videos">
            <div className="merch-video-card">
              <div className="merch-video-wrap">
                <video autoPlay loop muted playsInline className="merch-video">
                  <source src="/assets/merch_video1.mp4" type="video/mp4" />
                </video>
                <div className="video-card-overlay"></div>
              </div>
              <span className="merch-video-caption">// Live Vibe 01</span>
            </div>
            <div className="merch-video-card">
              <div className="merch-video-wrap">
                <video autoPlay loop muted playsInline className="merch-video">
                  <source src="/assets/merch_video2.mp4" type="video/mp4" />
                </video>
                <div className="video-card-overlay"></div>
              </div>
              <span className="merch-video-caption">// Live Vibe 02</span>
            </div>
          </div>

          {/* Product showcase grid */}
          <div className="merch-grid">
            <div className="merch-card">
              <div className="merch-img-wrap">
                <img
                  src="/assets/merch_going_underground.jpg"
                  alt="Going Underground Tee"
                  className="merch-img"
                  loading="lazy"
                />
                <div className="merch-card-glow"></div>
              </div>
              <div className="merch-info">
                <h3 className="merch-title">Going Underground Tee</h3>
                <div className="merch-size-selector">
                  <span className="size-label">Select Size</span>
                  <div className="size-options">
                    {["S", "M", "L", "XL", "XXL"].map((sz) => (
                      <span
                        key={sz}
                        className={`size-chip ${goingUndergroundSize === sz ? "active" : ""}`}
                        onClick={() => setGoingUndergroundSize(sz)}
                      >
                        {sz}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="merch-desc">
                  Premium heavyweight white cotton tee featuring our signature navigation maze graphic.
                </p>
                <a
                  href={`https://wa.me/910000000000?text=${encodeURIComponent(
                    `I am interested in the Going Underground Tee in size ${goingUndergroundSize}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="merch-buy-btn"
                >
                  Inquire Size {goingUndergroundSize} <i className="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>

            <div className="merch-card">
              <div className="merch-img-wrap">
                <img
                  src="/assets/merch_spiral_black.jpg"
                  alt="Hypnotic Brew Tee"
                  className="merch-img"
                  loading="lazy"
                />
                <div className="merch-card-glow"></div>
              </div>
              <div className="merch-info">
                <h3 className="merch-title">Hypnotic Brew Tee</h3>
                <div className="merch-size-selector">
                  <span className="size-label">Select Size</span>
                  <div className="size-options">
                    {["S", "M", "L", "XL", "XXL"].map((sz) => (
                      <span
                        key={sz}
                        className={`size-chip ${hypnoticBrewSize === sz ? "active" : ""}`}
                        onClick={() => setHypnoticBrewSize(sz)}
                      >
                        {sz}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="merch-desc">
                  Super-soft washed black cotton tee featuring the custom hypnotic swirl espresso art.
                </p>
                <a
                  href={`https://wa.me/910000000000?text=${encodeURIComponent(
                    `I am interested in the Hypnotic Brew Tee in size ${hypnoticBrewSize}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="merch-buy-btn"
                >
                  Inquire Size {hypnoticBrewSize} <i className="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>

            <div className="merch-card">
              <div className="merch-img-wrap">
                <img
                  src="/assets/merch_display.jpg"
                  alt="Signature Gear"
                  className="merch-img"
                  loading="lazy"
                />
                <div className="merch-card-glow"></div>
              </div>
              <div className="merch-info">
                <h3 className="merch-title">Signature Gear Display</h3>
                <div className="merch-size-selector">
                  <span className="size-label">Size</span>
                  <div className="size-options">
                    <span className="size-chip size-chip-wide">One Size / Adjustable</span>
                  </div>
                </div>
                <p className="merch-desc">
                  Dad hats and limited accessories. Ask at the counter to view our full rack items.
                </p>
                <a href="https://wa.me/910000000000?text=I%20am%20interested%20in%20the%20Signature%20Gear%20Collection" target="_blank" rel="noopener noreferrer" className="merch-buy-btn">
                  Inquire Store <i className="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: GALLERY */}
      <section className="gallery-section" id="gallery">
        <div className="gallery-header">
          <span className="section-eyebrow">Life at UNDERGROUND</span>
          <h2 className="section-title">Our <em>Gallery</em></h2>
        </div>

        <div className="masonry-grid" id="masonry-grid">
          <div className="masonry-item masonry-tall">
            <img
              src="/assets/gal_cookies.jpg"
              alt="Fresh Baked Cookies"
              loading="lazy"
            />
            <div className="masonry-caption">Fresh Baked Cookies</div>
          </div>
          <div className="masonry-item">
            <img
              src="/assets/gal_cheesecake.jpg"
              alt="Basque Cheesecake"
              loading="lazy"
            />
            <div className="masonry-caption">Basque Cheesecake</div>
          </div>
          <div className="masonry-item masonry-tall">
            <img
              src="/assets/gal_latte_bun.jpg"
              alt="Morning Ritual"
              loading="lazy"
            />
            <div className="masonry-caption">Morning Ritual</div>
          </div>
          <div className="masonry-item">
            <img
              src="/assets/gal_balcony.jpg"
              alt="Balcony Escape"
              loading="lazy"
            />
            <div className="masonry-caption">Balcony Escape</div>
          </div>
          <div className="masonry-item masonry-tall">
            <img
              src="/assets/gal_chocolate_tart.jpg"
              alt="Double Chocolate Tart"
              loading="lazy"
            />
            <div className="masonry-caption">Double Chocolate Tart</div>
          </div>
          <div className="masonry-item">
            <img
              src="/assets/gal_matcha_juice.jpg"
              alt="Signature Layered Matcha"
              loading="lazy"
            />
            <div className="masonry-caption">Signature Layered Matcha</div>
          </div>
          <div className="masonry-item masonry-tall">
            <img
              src="/assets/gal_interior.jpg"
              alt="Lounge Vibe"
              loading="lazy"
            />
            <div className="masonry-caption">Lounge Vibe</div>
          </div>
          <div className="masonry-item">
            <img
              src="/assets/gal_irish_coffee.jpg"
              alt="Signature Irish Coffee"
              loading="lazy"
            />
            <div className="masonry-caption">Signature Irish Coffee</div>
          </div>
          <div className="masonry-item masonry-tall">
            <img
              src="/assets/gal_blueberry_tart.jpg"
              alt="Blueberry Chocolate Tart"
              loading="lazy"
            />
            <div className="masonry-caption">Blueberry Chocolate Tart</div>
          </div>
          <div className="masonry-item">
            <img
              src="/assets/gal_cookies_alt.jpg"
              alt="Underground Treats"
              loading="lazy"
            />
            <div className="masonry-caption">Underground Treats</div>
          </div>
          <div className="masonry-item">
            <img
              src="/assets/gal_counter.jpg"
              alt="The Coffee Station"
              loading="lazy"
            />
            <div className="masonry-caption">The Coffee Station</div>
          </div>
          <div className="masonry-item masonry-tall">
            <img
              src="/assets/gal_poster_collage.jpg"
              alt="Art &amp; Ambience"
              loading="lazy"
            />
            <div className="masonry-caption">Art &amp; Ambience</div>
          </div>
          <div className="masonry-item">
            <img
              src="/assets/gal_barista_hand.jpg"
              alt="Crafting Espresso"
              loading="lazy"
            />
            <div className="masonry-caption">Crafting Espresso</div>
          </div>
          <div className="masonry-item masonry-wide">
            <img
              src="/assets/gal_sticky_notes.jpg"
              alt="Guest Notes"
              loading="lazy"
            />
            <div className="masonry-caption">Guest Notes</div>
          </div>
          <div className="masonry-item masonry-tall">
            <img
              src="/assets/gal_seating_table.jpg"
              alt="Cafe Corner"
              loading="lazy"
            />
            <div className="masonry-caption">Cafe Corner</div>
          </div>
          <div className="masonry-item">
            <img
              src="/assets/gal_three_coffees.jpg"
              alt="A Coffee for Everyone"
              loading="lazy"
            />
            <div className="masonry-caption">A Coffee for Everyone</div>
          </div>
          <div className="masonry-item masonry-tall">
            <img
              src="/assets/gal_caramel_cake.jpg"
              alt="Biscoff Cheesecake"
              loading="lazy"
            />
            <div className="masonry-caption">Biscoff Cheesecake</div>
          </div>
          <div className="masonry-item">
            <img
              src="/assets/gal_flat_white.jpg"
              alt="Flat White Close-up"
              loading="lazy"
            />
            <div className="masonry-caption">Flat White Close-up</div>
          </div>
          <div className="masonry-item masonry-tall">
            <img
              src="/assets/gal_stools_view.jpg"
              alt="Window Seating"
              loading="lazy"
            />
            <div className="masonry-caption">Window Seating</div>
          </div>
          <div className="masonry-item">
            <img
              src="/assets/gal_workspace_vibe.jpg"
              alt="Workspace Ambience"
              loading="lazy"
            />
            <div className="masonry-caption">Workspace Ambience</div>
          </div>
        </div>
      </section>

      {/* SECTION: CLIENT REVIEWS */}
      <section className="reviews-section" id="reviews">
        <div className="reviews-header">
          <span className="section-eyebrow">Reviews</span>
          <h2 className="section-title">Client <em>Reviews</em></h2>
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
                {"\"The chill evening vibes here are unmatched. Their cold brew is easily the best in Mangaluru, and the music sets the perfect mood.\""}
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
                {"\"UNDERGROUND 11 is a hidden gem. The attention to detail in their coffee and the velvet latte is incredible. An absolute must-visit!\""}
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
                {"\"A perfect place to unwind. Love the aesthetic, the silent lofi beats, and the strawberry caramel cake. My favorite evening spot.\""}
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
        <div className="visit-watermark">UNDERGROUND 11</div>

        <div className="visit-inner">
          <div className="visit-header">
            <span className="section-eyebrow">Find Us</span>
            <h2 className="section-title visit-title">
              Come
              <br />
              <em>Visit Us</em>
            </h2>
          </div>

          <div className="visit-grid">
            <div className="visit-card">
              <div className="visit-card-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3 className="visit-card-title">Location</h3>
              <p className="visit-card-body">
                UNDERGROUND 11 Coffee Bar
                <br />
                Ground Floor, Mindspace Building
                <br />
                Airport Road, Yeyyadi, Mangaluru
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=UNDERGROUND+11+Coffee+Bar,+Ground+Floor,+Mindspace+Building,+Airport+Road,+Yeyyadi,+Mangaluru"
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
                  <span>Monday</span>
                  <span style={{ color: "var(--accent)" }}>Closed</span>
                </div>
                <div className="hours-row">
                  <span>Tuesday</span>
                  <span>10:00 AM – 8:30 PM</span>
                </div>
                <div className="hours-row">
                  <span>Wednesday</span>
                  <span>10:00 AM – 8:30 PM</span>
                </div>
                <div className="hours-row">
                  <span>Thursday</span>
                  <span>10:00 AM – 8:30 PM</span>
                </div>
                <div className="hours-row">
                  <span>Friday</span>
                  <span>10:00 AM – 8:30 PM</span>
                </div>
                <div className="hours-row">
                  <span>Saturday</span>
                  <span>10:00 AM – 8:30 PM</span>
                </div>
                <div className="hours-row">
                  <span>Sunday</span>
                  <span>10:30 AM – 8:30 PM</span>
                </div>
              </div>
            </div>

            <div className="visit-card social-card">
              <div className="visit-card-icon">
                <i className="fas fa-share-alt"></i>
              </div>
              <h3 className="visit-card-title">Follow Us</h3>
              <p className="visit-card-body">
                Connect with us online — follow our journey or message us directly.
              </p>
              <div className="social-icons-grid">
                <a
                  href="https://www.instagram.com/underground11_coffeebar"
                  target="_blank"
                  className="social-icon-btn insta-btn"
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="https://wa.me/910000000000"
                  target="_blank"
                  className="social-icon-btn wa-btn"
                  aria-label="WhatsApp"
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>

            {/* Premium Map Card */}
            <div className="visit-card visit-card-map">
              <a 
                href="https://www.google.com/maps/search/?api=1&query=UNDERGROUND+11+Coffee+Bar,+Ground+Floor,+Mindspace+Building,+Airport+Road,+Yeyyadi,+Mangaluru"
                target="_blank" 
                rel="noopener noreferrer"
                className="map-card-link-wrapper"
                title="Click to open location in Google Maps"
              >
                <div className="map-embed-wrap">
                  {/* Google Maps in Day Mode */}
                  <iframe
                    src="https://maps.google.com/maps?q=UNDERGROUND+11+Coffee+Bar,+Ground+Floor,+Mindspace+Building,+Airport+Road,+Yeyyadi,+Mangaluru&t=&z=17&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{
                      border: 0,
                      pointerEvents: "none"
                    }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Underground 11 Coffee Bar Location"
                  ></iframe>
                </div>
              </a>
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
              UNDERGROUND 11 Coffee Bar
              <br />
              <em>Specialty Coffee &amp; Handcrafted Brews</em>
            </p>
          </div>
          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#menu">Menu</a>
            <a href="#atmosphere">Atmosphere</a>
            <a href="#merch">Merchandise</a>
            <a href="#gallery">Gallery</a>
            <a href="#visit">Visit</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 UNDERGROUND 11 Coffee Bar. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}
