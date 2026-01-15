// Portfolio Animation System
// Handles all microanimations throughout the site

class AnimationController {
  constructor() {
    this.observers = new Map();
  }

  // Initialize all animations
  init() {
    this.initScrollAnimations();
    this.initButtonAnimations();
  }

  // Scroll-triggered animations
  initScrollAnimations() {
    const projectCards = document.querySelectorAll(".project-card");

    if (projectCards.length === 0) return;

    // Create intersection observer
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          } else {
            entry.target.classList.remove("animate-in");
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% visible
        rootMargin: "0px 0px -50px 0px", // Start animation 50px before fully visible
      }
    );

    // Observe all project cards
    projectCards.forEach((card) => {
      card.classList.add("animate-on-scroll");
      scrollObserver.observe(card);
    });

    this.observers.set("scroll", scrollObserver);
  }

  // Button click animations
  initButtonAnimations() {
    const buttons = document.querySelectorAll("button:not(.modal-close)");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        button.classList.remove("btn-clicked");
        button.offsetHeight; // Force reflow
        button.classList.add("btn-clicked");
      });
    });
  }

  // Cleanup observers when needed
  destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
  }
}

// Export animation controller
export const animationController = new AnimationController();

// Auto-initialize
export function initAnimations() {
  animationController.init();
}
