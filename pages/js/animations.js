/**
 * PORTFOLIO ANIMATION SYSTEM
 * Handles all microanimations throughout the site including:
 * - Scroll-triggered animations
 * - Button click effects
 * - Dynamic title text cycling
 * - Observer pattern management
 */

export class AnimationController {
  constructor() {
    this.observers = new Map();
    this.init();
  }

  /**
   * Initialize all animation systems
   * Called automatically on instantiation
   */
  init() {
    this.initScrollAnimations();
    this.initButtonAnimations();
    this.setupTitleAnimation();
    this.initCubeInteraction();
  }

  /**
   * Sets up scroll-triggered animations using Intersection Observer
   * - Animates project and skill cards on scroll
   * - Uses efficient observer pattern for performance
   */
  initScrollAnimations() {
    const projectCards = document.querySelectorAll(".project-card");
    const skillCards = document.querySelectorAll(".skills-category");

    if (projectCards.length === 0 && skillCards.length === 0) return;

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
      },
    );

    // Observe all project cards
    projectCards.forEach((card) => {
      card.classList.add("animate-on-scroll");
      scrollObserver.observe(card);
    });

    // Observe all skill cards
    skillCards.forEach((card) => {
      card.classList.add("animate-on-scroll");
      scrollObserver.observe(card);
    });

    this.observers.set("scroll", scrollObserver);
  }

  /**
   * Sets up button click animations
   * - Adds elastic click effect to all buttons
   * - Excludes modal close buttons
   */
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

  /* ==========================================================================
     TITLE ANIMATION SYSTEM
     Manages dynamic text cycling in hero section
     ========================================================================== */

  /**
   * Initializes dynamic title animation
   * - Finds all elements with .dynamic-title class
   * - Starts cycling animation with predefined titles
   */
  setupTitleAnimation() {
    const titleElements = document.querySelectorAll(".dynamic-title");
    if (titleElements.length === 0) {
      console.error("No .dynamic-title elements found");
      return;
    }

    titleElements.forEach((element) => {
      this.cycleTitles(element, [
        "Modern Workflow",
        "Clean Code",
        "Rapid Prototyping",
        "System Design",
        "AI-Assisted",
        "Problem Solving",
      ]);
    });
  }
  cycleTitles(element, titles) {
    let currentIndex = 0;

    const updateTitle = () => {
      element.textContent = titles[currentIndex];
      currentIndex = (currentIndex + 1) % titles.length;
    };

    // Start immediately, then set interval
    updateTitle();
    setTimeout(() => {
      updateTitle();
      setInterval(updateTitle, 7000); // Change every 7 seconds
    }, 4400); // Initial delay for smooth start
  } /**
/**
 * Initialize mouse-following cube animation
 * Mouse direction + drag momentum
 */
  initCubeInteraction() {
    const cube = document.querySelector(".cube");
    const cubeContainer = document.querySelector(".cube-container");
    if (!cube || !cubeContainer) return;

    let currentRotationX = 0;
    let currentRotationY = 0;
    let targetSpinX = 0.1; // Gentle default
    let targetSpinY = 0.15; // Gentle default
    let momentumX = 0;
    let momentumY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // Mouse move handler
    const handleMouseMove = (e) => {
      const rect = cubeContainer.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Calculate mouse velocity for drag momentum
      const velocityX = mouseX - lastMouseX;
      const velocityY = mouseY - lastMouseY;

      // Add momentum from quick mouse movements
      if (Math.abs(velocityX) > 5 || Math.abs(velocityY) > 5) {
        momentumX += velocityY * 0.02; // Cross velocity for spin
        momentumY += velocityX * 0.02;
      }

      // Convert to gentle spin direction
      targetSpinY = (mouseX / 1000) * 0.4;
      targetSpinX = -(mouseY / 1000) * 0.4;

      lastMouseX = mouseX;
      lastMouseY = mouseY;
    };

    // Animation loop with momentum
    const animateCube = () => {
      // Apply base spin + momentum
      currentRotationY += targetSpinY + momentumY;
      currentRotationX += targetSpinX + momentumX;

      // Smooth momentum decay
      momentumX *= 0.92;
      momentumY *= 0.92;

      cube.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;

      requestAnimationFrame(animateCube);
    };

    // Start listening
    document.addEventListener("mousemove", handleMouseMove);
    animateCube();
  }
}
