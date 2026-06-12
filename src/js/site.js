// The only JavaScript on the site. Progressive enhancement only:
// the mobile menu and carousels degrade to working markup without it.

// --- Mobile menu toggle ---------------------------------------------------
(function () {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("hidden") === false;
    toggle.setAttribute("aria-expanded", String(open));
  });
})();

// --- Lightbox (shared full-screen photo viewer) ---------------------------
const Lightbox = (function () {
  const root = document.querySelector("[data-lightbox]");
  if (!root) return null;

  const imgEl = root.querySelector("[data-lightbox-img]");
  const captionEl = root.querySelector("[data-lightbox-caption]");
  const counterEl = root.querySelector("[data-lightbox-counter]");
  const btnPrev = root.querySelector("[data-lightbox-prev]");
  const btnNext = root.querySelector("[data-lightbox-next]");
  const btnClose = root.querySelector("[data-lightbox-close]");
  const backdrop = root.querySelector("[data-lightbox-backdrop]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let images = [];
  let index = 0;
  let lastFocused = null;

  const focusable = () =>
    [btnClose, btnPrev, btnNext].filter((b) => b && !b.classList.contains("hidden"));

  function render() {
    const item = images[index];
    if (!item) return;
    const swap = () => {
      imgEl.src = item.src;
      imgEl.alt = item.alt || "";
      captionEl.textContent = item.caption || "";
      captionEl.classList.toggle("hidden", !item.caption);
      counterEl.textContent = images.length > 1 ? `${index + 1} / ${images.length}` : "";
    };
    if (reduceMotion) {
      swap();
      imgEl.style.opacity = "1";
      return;
    }
    imgEl.style.opacity = "0";
    swap();
    if (imgEl.complete) {
      requestAnimationFrame(() => (imgEl.style.opacity = "1"));
    } else {
      imgEl.onload = () => (imgEl.style.opacity = "1");
    }
  }

  function go(delta) {
    if (images.length < 2) return;
    index = (index + delta + images.length) % images.length;
    render();
  }

  function onKey(e) {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowLeft") {
      go(-1);
    } else if (e.key === "ArrowRight") {
      go(1);
    } else if (e.key === "Tab") {
      const f = focusable();
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (!root.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function open(imgs, startIndex) {
    images = imgs;
    index = startIndex || 0;
    lastFocused = document.activeElement;

    const multi = images.length > 1;
    btnPrev.classList.toggle("hidden", !multi);
    btnNext.classList.toggle("hidden", !multi);

    render();
    root.classList.remove("hidden");
    root.classList.add("flex");
    root.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";

    requestAnimationFrame(() => {
      root.classList.add("opacity-100");
      imgEl.classList.remove("scale-95");
      imgEl.classList.add("scale-100");
    });

    btnClose.focus();
    document.addEventListener("keydown", onKey);
  }

  function close() {
    root.classList.remove("opacity-100");
    imgEl.classList.remove("scale-100");
    imgEl.classList.add("scale-95");
    root.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", onKey);

    const finish = () => {
      root.classList.add("hidden");
      root.classList.remove("flex");
      document.documentElement.style.overflow = "";
      imgEl.src = "";
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    };
    if (reduceMotion) finish();
    else setTimeout(finish, 200);
  }

  btnClose.addEventListener("click", close);
  backdrop.addEventListener("click", close);
  btnPrev.addEventListener("click", () => go(-1));
  btnNext.addEventListener("click", () => go(1));

  return { open };
})();

// --- Carousels ------------------------------------------------------------
(function () {
  const carousels = document.querySelectorAll("[data-carousel]");

  carousels.forEach((root) => {
    const track = root.querySelector("[data-carousel-track]");
    const prev = root.querySelector("[data-carousel-prev]");
    const next = root.querySelector("[data-carousel-next]");
    const dotsWrap = root.querySelector("[data-carousel-dots]");
    const slides = Array.from(root.querySelectorAll(".carousel-slide"));
    if (!track || slides.length < 1) return;

    // Drag state, declared up front so the zoom-click guard can read it.
    let dragOccurred = false;

    // Build this carousel's image list (read straight from the slides).
    const images = slides.map((s) => {
      const img = s.querySelector("img");
      const cap = s.querySelector("figcaption");
      return {
        src: img ? img.currentSrc || img.src : "",
        alt: img ? img.alt : "",
        caption: cap ? cap.textContent.trim() : "",
      };
    });

    // Clicking a photo opens the full-screen lightbox at that index.
    if (Lightbox) {
      root.querySelectorAll("[data-carousel-zoom]").forEach((btn, i) => {
        btn.addEventListener("click", () => {
          if (!dragOccurred) Lightbox.open(images, i);
        });
      });
    }

    // A single-photo "carousel" only needs the zoom behaviour above.
    if (slides.length < 2) return;

    // Reveal controls now that JS is running.
    [prev, next].forEach((b) => b && b.classList.replace("hidden", "flex"));

    const scrollToSlide = (i) => {
      const idx = Math.max(0, Math.min(i, slides.length - 1));
      track.scrollTo({ left: slides[idx].offsetLeft - track.offsetLeft, behavior: "smooth" });
    };

    const currentIndex = () => {
      const x = track.scrollLeft + track.offsetLeft;
      let best = 0;
      let bestDist = Infinity;
      slides.forEach((s, i) => {
        const d = Math.abs(s.offsetLeft - x);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      return best;
    };

    prev && prev.addEventListener("click", () => scrollToSlide(currentIndex() - 1));
    next && next.addEventListener("click", () => scrollToSlide(currentIndex() + 1));

    // Dot indicators.
    let dots = [];
    if (dotsWrap) {
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "h-2.5 w-2.5 rounded-full bg-brand-ink/20 transition";
        dot.setAttribute("aria-label", `Go to photo ${i + 1}`);
        dot.addEventListener("click", () => scrollToSlide(i));
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    const syncDots = () => {
      const active = currentIndex();
      dots.forEach((d, i) => d.classList.toggle("bg-brand-green", i === active));
    };

    let raf;
    track.addEventListener("scroll", () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncDots);
    });
    syncDots();

    // --- Mouse drag-to-pan ---
    // Mouse only: touch and trackpad already pan natively (and better).
    const DRAG_THRESHOLD = 6;
    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let pointerId = null;

    track.classList.add("cursor-grab");

    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      dragOccurred = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      pointerId = e.pointerId;
    });

    track.addEventListener("pointermove", (e) => {
      if (!dragging || e.pointerType !== "mouse") return;
      const dx = e.clientX - startX;
      if (!dragOccurred && Math.abs(dx) > DRAG_THRESHOLD) {
        dragOccurred = true;
        track.classList.add("cursor-grabbing");
        track.style.scrollSnapType = "none"; // free panning while dragging
        try {
          track.setPointerCapture(pointerId);
        } catch (_) {}
      }
      if (dragOccurred) {
        e.preventDefault();
        track.scrollLeft = startScroll - dx;
      }
    });

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("cursor-grabbing");
      if (dragOccurred) {
        track.style.scrollSnapType = ""; // restore snapping
        scrollToSlide(currentIndex()); // settle on the nearest photo
      }
      // dragOccurred stays true until the next pointerdown so the trailing
      // click (which would otherwise open the lightbox) is ignored.
    };

    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("pointerleave", endDrag);
  });
})();
