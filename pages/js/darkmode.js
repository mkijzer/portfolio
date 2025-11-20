// Dark mode animation controller
export function triggerDarkModeAnimations() {
  const tiles = document.querySelectorAll(
    ".about-grid .card, .info-cards .card"
  );

  tiles.forEach((tile, index) => {
    // Reset animation
    tile.style.animation = "none";
    tile.offsetHeight; // Force reflow

    // Apply subtle scale animation for dark mode
    tile.style.animation = `scaleIn 0.3s cubic-bezier(0.4, 0.0, 0.2, 1) forwards`;
    tile.style.animationDelay = `${index * 0.05}s`;
  });
}

// Add scale animation for dark mode (will be added to CSS)
function addDarkModeStyles() {
  if (!document.getElementById("dark-mode-animations")) {
    const style = document.createElement("style");
    style.id = "dark-mode-animations";
    style.textContent = `
      @keyframes scaleIn {
        0% {
          transform: scale(0.95);
          opacity: 0.8;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize dark mode enhancements
export function initDarkModeEnhancements() {
  addDarkModeStyles();
  console.log("Dark mode enhancements initialized");
}

// Auto-initialize when module loads
initDarkModeEnhancements();
