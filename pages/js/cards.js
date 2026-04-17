/**
 * CARD INTERACTION SYSTEM
 * Handles profile card flip animations and interactions including:
 * - Learn More button functionality
 * - Back button navigation
 * - Smooth flip animations
 * - Card state management
 */

export class CardController {
  constructor() {
    // Don't auto-initialize - let app.js control timing
  }

  /**
   * Initialize card interaction system
   * Sets up all card-related functionality
   */
  init() {
    this.setupCardFlip();
  }

  /**
   * Sets up profile card flip functionality
   * - Handles Learn More button to show detailed bio
   * - Handles Back button to return to main view
   * - Manages smooth flip animations
   */
  setupCardFlip() {
    const learnMoreBtn = document.querySelector(".btn-secondary");
    const backBtn = document.querySelector(".btn-back");
    const profileCard = document.querySelector(".profile-card");

    // Setup flip to back side (detailed bio)
    if (learnMoreBtn && profileCard) {
      learnMoreBtn.addEventListener("click", () => {
        profileCard.style.animation = "profileFlip 0.6s ease-in-out forwards";
        profileCard.classList.add("flipped");
      });
    }

    // Setup flip to front side (main intro)
    if (backBtn && profileCard) {
      backBtn.addEventListener("click", () => {
        profileCard.style.animation =
          "profileFlipBack 0.6s ease-in-out forwards";
        profileCard.classList.remove("flipped");
      });
    }
  }
}
