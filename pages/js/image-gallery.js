/**
 * IMAGE GALLERY CONTROLLER
 * Handles image carousel and modal gallery display
 * - Image navigation with arrows and dots
 * - Modal gallery with blur backdrop
 * - Swipe support for mobile
 * - Keyboard navigation
 */

export class ImageGalleryController {
  constructor() {
    this.currentImageIndex = 0;
    this.images = [];
    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  /**
   * Attaches image gallery functionality to a card
   * @param {HTMLElement} card - Project card element
   * @param {Array} images - Array of image paths
   */
  attachGalleryToCard(card, images) {
    if (!images || images.length === 0) return;

    this.images = images;
    const imageElement = card.querySelector(
      ".modal-card-image, .featured-project-image",
    );

    if (!imageElement) return;

    const imageContainer = imageElement.parentElement;

    // Add click handler to open modal
    imageElement.addEventListener("click", (e) => {
      e.stopPropagation();
      this.openGalleryModal(images, 0);
    });
  }

  /**
   * Adds dots indicator inside image container
   * @param {HTMLElement} container - Image container element
   * @param {number} imageCount - Number of images
   */
  addDotsIndicator(container, imageCount) {
    if (imageCount <= 1) return;

    const dotsContainer = document.createElement("div");
    dotsContainer.className = "image-gallery-dots";

    for (let i = 0; i < imageCount; i++) {
      const dot = document.createElement("span");
      dot.className = `gallery-dot ${i === 0 ? "active" : ""}`;
      dotsContainer.appendChild(dot);
    }

    container.appendChild(dotsContainer);
  }

  /**
   * Opens full-screen gallery modal
   * @param {Array} images - Array of image paths
   * @param {number} startIndex - Starting image index
   */
  openGalleryModal(images, startIndex = 0) {
    this.images = images;
    this.currentImageIndex = startIndex;

    const modal = this.createGalleryModal();
    document.body.appendChild(modal);

    // Trigger entrance animation
    requestAnimationFrame(() => {
      modal.classList.add("gallery-open");
    });

    // Setup event listeners
    this.setupGalleryEventListeners(modal);
  }

  /**
   * Creates the gallery modal HTML
   * @returns {HTMLElement} Gallery modal element
   */
  createGalleryModal() {
    const modal = document.createElement("div");
    modal.className = "image-gallery-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-label", "Image gallery");

    modal.innerHTML = `
      <div class="gallery-backdrop"></div>
      <div class="gallery-content">
        <button class="gallery-close" aria-label="Close gallery">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <button class="gallery-arrow gallery-prev" aria-label="Previous image">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div class="gallery-image-container">
          <img 
            src="${this.images[this.currentImageIndex]}" 
            alt="Project screenshot ${this.currentImageIndex + 1}"
            class="gallery-image"
          />
          <div class="gallery-dots">
            ${this.images
              .map(
                (_, index) =>
                  `<span class="gallery-dot ${index === this.currentImageIndex ? "active" : ""}"></span>`,
              )
              .join("")}
          </div>
        </div>

        <button class="gallery-arrow gallery-next" aria-label="Next image">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    `;

    return modal;
  }

  /**
   * Sets up all gallery event listeners
   * @param {HTMLElement} modal - Gallery modal element
   */
  setupGalleryEventListeners(modal) {
    const closeBtn = modal.querySelector(".gallery-close");
    const backdrop = modal.querySelector(".gallery-backdrop");
    const prevBtn = modal.querySelector(".gallery-prev");
    const nextBtn = modal.querySelector(".gallery-next");
    const imageContainer = modal.querySelector(".gallery-image-container");

    // Close handlers
    const closeGallery = () => this.closeGalleryModal(modal);
    closeBtn.addEventListener("click", closeGallery);
    backdrop.addEventListener("click", closeGallery);

    // Navigation handlers
    prevBtn.addEventListener("click", () => this.navigateGallery(modal, -1));
    nextBtn.addEventListener("click", () => this.navigateGallery(modal, 1));

    // Keyboard navigation
    modal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowLeft") this.navigateGallery(modal, -1);
      if (e.key === "ArrowRight") this.navigateGallery(modal, 1);
    });

    // Touch/swipe support
    imageContainer.addEventListener("touchstart", (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    });

    imageContainer.addEventListener("touchend", (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(modal);
    });

    // Focus management
    setTimeout(() => {
      closeBtn.focus();
    }, 100);
  }

  /**
   * Navigates to next/previous image
   * @param {HTMLElement} modal - Gallery modal element
   * @param {number} direction - Direction (-1 for prev, 1 for next)
   */
  navigateGallery(modal, direction) {
    const newIndex = this.currentImageIndex + direction;

    // Loop around
    if (newIndex < 0) {
      this.currentImageIndex = this.images.length - 1;
    } else if (newIndex >= this.images.length) {
      this.currentImageIndex = 0;
    } else {
      this.currentImageIndex = newIndex;
    }

    this.updateGalleryImage(modal);
  }

  /**
   * Updates the displayed image and dots
   * @param {HTMLElement} modal - Gallery modal element
   */
  updateGalleryImage(modal) {
    const img = modal.querySelector(".gallery-image");
    const dots = modal.querySelectorAll(".gallery-dot");

    // Fade out
    img.style.opacity = "0";

    setTimeout(() => {
      // Update image
      img.src = this.images[this.currentImageIndex];
      img.alt = `Project screenshot ${this.currentImageIndex + 1}`;

      // Update dots
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === this.currentImageIndex);
      });

      // Fade in
      img.style.opacity = "1";
    }, 150);
  }

  /**
   * Handles swipe gestures
   * @param {HTMLElement} modal - Gallery modal element
   */
  handleSwipe(modal) {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next image
        this.navigateGallery(modal, 1);
      } else {
        // Swipe right - previous image
        this.navigateGallery(modal, -1);
      }
    }
  }

  /**
   * Closes the gallery modal with animation
   * @param {HTMLElement} modal - Gallery modal element
   */
  closeGalleryModal(modal) {
    modal.classList.add("gallery-closing");
    setTimeout(() => {
      document.body.removeChild(modal);
    }, 300);
  }
}
