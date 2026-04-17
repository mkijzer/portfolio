/**
 * NAVIGATION SYSTEM
 * Handles URL routing, hash management, and smooth scrolling including:
 * - Active navigation link management
 * - Hash-based routing
 * - Smooth scrolling to sections
 * - Browser back/forward button support
 */

export class NavigationController {
  constructor() {
    this.init();
  }

  /**
   * Initialize navigation system
   * Sets up all navigation functionality
   */
  init() {
    this.setupNavigation();
    this.setupBrowserNavigation();
  }

  /**
   * Sets up navigation event listeners and initial state
   * - Manages active nav link states
   * - Handles hash-based routing
   * - Provides smooth scrolling to sections
   */
  setupNavigation() {
    const currentHash = window.location.hash || "#portfolio";
    const allLinks = document.querySelectorAll(".nav-link");

    allLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        // Update active states
        allLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");

        // Update URL and scroll to section
        const href = link.getAttribute("href");
        window.location.hash = href;
        const targetSection = document.querySelector(href);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth" });
        }
      });

      // Set initial active state based on current hash
      if (link.getAttribute("href") === currentHash) {
        link.classList.add("active");
      }
    });
  }

  /**
   * Sets up browser navigation (back/forward button support)
   * Handles popstate events for proper navigation history
   */
  setupBrowserNavigation() {
    window.addEventListener("popstate", () => {
      const hash = window.location.hash || "#portfolio";
      const activeLink = document.querySelector(`[href="${hash}"]`);

      if (activeLink) {
        // Update active states
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.remove("active");
        });
        activeLink.classList.add("active");

        // Scroll to section
        const targetSection = document.querySelector(hash);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }

  /**
   * Utility method to programmatically navigate to a section
   * @param {string} sectionId - ID of section to navigate to (with or without #)
   */
  navigateToSection(sectionId) {
    const hash = sectionId.startsWith("#") ? sectionId : `#${sectionId}`;
    const targetSection = document.querySelector(hash);

    if (targetSection) {
      window.location.hash = hash;
      targetSection.scrollIntoView({ behavior: "smooth" });

      // Update active nav link
      const activeLink = document.querySelector(`[href="${hash}"]`);
      if (activeLink) {
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.remove("active");
        });
        activeLink.classList.add("active");
      }
    }
  }
}
