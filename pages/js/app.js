/**
 * PORTFOLIO APPLICATION - MAIN ORCHESTRATOR
 *
 * Modern ES6 modular application that coordinates all portfolio functionality.
 * Uses dependency injection and modular architecture for:
 * - Navigation and routing
 * - Contact form and modal system
 * - Profile card interactions
 * - Project loading and display
 * - Animation management
 *
 * @author Mike
 * @version 2.0 - Modular ES6 Architecture
 */

// Import all controller modules
import { NavigationController } from "./navigation.js";
import { ContactController } from "./contact.js";
import { CardController } from "./cards.js";
import { ProjectController } from "./projects.js";
import { AnimationController } from "./animations.js";

/**
 * Main Portfolio Application Class
 * Coordinates all subsystems and manages application state
 */
class PortfolioApp {
  constructor() {
    // Initialize all controllers
    this.navigation = new NavigationController();
    this.contact = new ContactController();
    this.cards = new CardController();
    this.projects = new ProjectController();
    this.animations = new AnimationController();

    this.initializeApp();
  }

  /**
   * APPLICATION INITIALIZATION
   * Initializes all subsystems in the correct order
   */
  initializeApp() {
    // Initialize all controllers
    this.navigation.init();
    this.contact.init();
    this.cards.init();
    this.projects.init();
    this.animations.init();
  }

  /**
   * Global method wrapper for opening project modal
   * Called from HTML onclick handlers
   */
  openProjectModal(selectedProject = null) {
    return this.projects.openProjectModal(selectedProject);
  }

  /**
   * Global scroll utility for external access
   */
  scrollToSection(sectionId) {
    return this.navigation.navigateToSection(sectionId);
  }

  /**
   * Cleanup method for destroying controllers
   * Useful for SPA navigation or testing
   */
  destroy() {
    this.animations.destroy();
    // Add other controller cleanup if needed
  }
}

/**
 * APPLICATION BOOTSTRAP
 * Initialize the application when DOM is ready
 */
document.addEventListener("DOMContentLoaded", () => {
  const app = new PortfolioApp();
  window.portfolioApp = app;
});

/**
 * BROWSER NAVIGATION HANDLING
 * Handle back/forward browser buttons
 * Note: This is also handled in NavigationController, but kept here for redundancy
 */
window.addEventListener("popstate", () => {
  const hash = window.location.hash || "#portfolio";
  const activeLink = document.querySelector(`[href="${hash}"]`);

  if (activeLink) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
    });
    activeLink.classList.add("active");
  }
});
