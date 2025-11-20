// Light mode animation controller
export function triggerLightModeAnimations() {
  const tiles = document.querySelectorAll(
    ".about-grid .card, .info-cards .card"
  );

  tiles.forEach((tile, index) => {
    // Reset animation
    tile.style.animation = "none";
    tile.offsetHeight; // Force reflow

    // Apply light mode animation with staggered delay
    tile.style.animation = `flipTileLight 0.4s cubic-bezier(0.4, 0.0, 0.2, 1) forwards`;
    tile.style.animationDelay = `${index * 0.1}s`;
  });
}

// Additional light mode specific functionality
export function initLightModeEnhancements() {
  // Add any light mode specific enhancements here
  console.log("Light mode enhancements initialized");
}
