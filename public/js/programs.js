const hexGrid = document.querySelector(".programs-hexagon-grid");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".lightbox .close");
const prevBtn = document.querySelector(".lightbox .prev");
const nextBtn = document.querySelector(".lightbox .next");

const numImages = 35;
let currentIndex = 0;

// Build grid
for (let i = 1; i <= numImages; i++) {
  const wrapper = document.createElement("div");
  const hex = document.createElement("div");

  // Thumbnail background
  hex.style.backgroundImage = `url(/images/gallery/thumbnails/${i}.webp)`;

  // Open lightbox on click
  hex.addEventListener("click", () => {
    currentIndex = i;
    openLightbox(i);
  });

  wrapper.appendChild(hex);
  hexGrid.appendChild(wrapper);
}

// Open lightbox
function openLightbox(index) {
  lightbox.style.display = "flex";
  lightboxImg.src = `/images/gallery/full/${index}.webp`;
}

// Close lightbox
closeBtn.addEventListener("click", () => {
  lightbox.style.display = "none";
});

// Navigate
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 < 1) ? numImages : currentIndex - 1;
  openLightbox(currentIndex);
});
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1 > numImages) ? 1 : currentIndex + 1;
  openLightbox(currentIndex);
});

// Close on backdrop click
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.style.display = "none";
});

// Close with ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") lightbox.style.display = "none";
  if (e.key === "ArrowLeft") prevBtn.click();
  if (e.key === "ArrowRight") nextBtn.click();
});
