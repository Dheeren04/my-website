// Automatically fills in the current year in the footer,
// so you never have to manually update "© 2026" -> "© 2027" etc.
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Scroll-driven cinematic blur on the hero photo =====
const heroBg = document.querySelector(".hero-bg");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (heroBg && !prefersReducedMotion) {
  const MAX_BLUR_PX = 10;     // how blurry it gets at full effect
  const MAX_SCALE = 1.08;     // how much it zooms in as it blurs (cinematic feel)
  const SCROLL_RANGE = 500;   // pixels of scrolling over which the effect fully develops

  let ticking = false; // prevents running this on every single scroll event (perf)

  function updateHeroBlur() {
    const scrollY = window.scrollY;

    // progress goes from 0 (top of page) to 1 (scrolled SCROLL_RANGE px or more)
    const progress = Math.min(scrollY / SCROLL_RANGE, 1);

    const blur = progress * MAX_BLUR_PX;
    const scale = 1 + progress * (MAX_SCALE - 1);

    heroBg.style.filter = `blur(${blur}px)`;
    heroBg.style.transform = `scale(${scale})`;

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    // requestAnimationFrame batches this to run once per repaint, not on every pixel scrolled
    if (!ticking) {
      requestAnimationFrame(updateHeroBlur);
      ticking = true;
    }
  });

  updateHeroBlur(); // run once on load in case the page is already scrolled (e.g. on refresh)
}
// ===== Certificate click-to-view modal =====
function openCertModal(imageSrc, certName) {
  const modal = document.getElementById("certModal");
  const modalImg = document.getElementById("certModalImg");
  modalImg.src = imageSrc;
  modalImg.alt = certName;
  modal.classList.add("active");
}

function closeCertModal(event) {
  // only close if the click was on the dark backdrop or the × button,
  // not on the certificate image itself
  if (event.target.id === "certModal" || event.target.classList.contains("cert-modal-close")) {
    document.getElementById("certModal").classList.remove("active");
  }
}

// allow closing with the Escape key too
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.getElementById("certModal").classList.remove("active");
  }
});
// ===== Dynamically load certificates from the backend =====
async function loadCertificates() {
  const grid = document.getElementById("certGrid");

  try {
    const response = await fetch("/api/certificates");
    const files = await response.json();

    if (files.length === 0) {
      grid.innerHTML = `<p class="cert-loading">No certificates added yet.</p>`;
      return;
    }

    grid.innerHTML = ""; // clear the "Loading…" message

    files.forEach(filename => {
      // turns "python-for-data-science.jpg" into "Python For Data Science"
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
      const title = nameWithoutExt
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());

      const card = document.createElement("div");
      card.className = "cert-card";
      card.innerHTML = `
        <span class="cert-icon">🏆</span>
        <div class="cert-info">
          <h3>${title}</h3>
        </div>
      `;
      card.addEventListener("click", () => openCertModal(`assets/certificates/${filename}`, title));
      grid.appendChild(card);
    });

  } catch (err) {
    grid.innerHTML = `<p class="cert-loading">Couldn't load certificates.</p>`;
    console.error(err);
  }
}

loadCertificates();